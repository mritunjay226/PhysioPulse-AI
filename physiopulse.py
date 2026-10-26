import os
import sys
import argparse
import http.server
import urllib.request
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import pyttsx3
import threading
import time
import json
from datetime import datetime

# ==========================================
# 0. AUTO-DOWNLOAD "FULL" PRECISION MODEL
# ==========================================
MODEL_PATH = "pose_landmarker_full.task"
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task"

if not os.path.exists(MODEL_PATH):
    print("⏳ Downloading High-Accuracy MediaPipe FULL Pose model (~9 MB)...")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    print("✅ Full precision model downloaded!")


# ==========================================
# 0.1 EMBEDDED WEB STREAMING SERVER
# ==========================================
latest_jpeg_frame = None
stream_lock = threading.Lock()
is_streaming = True
external_action = None  # 'skip' or 'quit'
live_telemetry = {}


class VideoStreamHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return  # Suppress console logging

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        global latest_jpeg_frame, stream_lock, is_streaming, external_action, live_telemetry

        if self.path.startswith('/video_feed'):
            self.send_response(200)
            self.send_header('Age', '0')
            self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            while is_streaming:
                frame_bytes = None
                with stream_lock:
                    frame_bytes = latest_jpeg_frame

                if frame_bytes is not None:
                    try:
                        self.wfile.write(b'--frame\r\n')
                        self.send_header('Content-Type', 'image/jpeg')
                        self.send_header('Content-Length', str(len(frame_bytes)))
                        self.end_headers()
                        self.wfile.write(frame_bytes)
                        self.wfile.write(b'\r\n')
                    except Exception:
                        break
                time.sleep(0.033)

        elif self.path.startswith('/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            with stream_lock:
                status_json = json.dumps(live_telemetry).encode('utf-8')
            self.wfile.write(status_json)

        elif self.path.startswith('/skip'):
            external_action = 'skip'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status":"skipping"}')

        elif self.path.startswith('/quit'):
            external_action = 'quit'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status":"quitting"}')

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        global external_action
        if self.path.startswith('/skip'):
            external_action = 'skip'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status":"skipping"}')
        elif self.path.startswith('/quit'):
            external_action = 'quit'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status":"quitting"}')
        else:
            self.send_response(404)
            self.end_headers()


# ==========================================
# 1. NON-BLOCKING VOICE COACH ENGINE
# ==========================================
class VoiceCoach:
    def __init__(self, cooldown=3.8):
        self.cooldown = cooldown
        self.last_spoken = 0
        self.lock = threading.Lock()

    def speak(self, text, force=False):
        now = time.time()
        if not force and (now - self.last_spoken < self.cooldown):
            return
        self.last_spoken = now
        threading.Thread(target=self._tts_worker, args=(text,), daemon=True).start()

    def _tts_worker(self, text):
        with self.lock:
            try:
                try:
                    import pythoncom
                    pythoncom.CoInitialize()
                except Exception:
                    pass
                engine = pyttsx3.init()
                engine.setProperty('rate', 175)
                engine.say(text)
                engine.runAndWait()
            except Exception:
                pass
            finally:
                try:
                    import pythoncom
                    pythoncom.CoUninitialize()
                except Exception:
                    pass


# ==========================================
# 2. EMA JITTER FILTER & BIOMECHANICS MATH
# ==========================================
class LandmarkSmoother:
    """Exponential Moving Average (EMA) filter to eliminate webcam landmark jitter."""
    def __init__(self, alpha=0.35):
        self.alpha = alpha
        self.state = {}

    def smooth(self, idx, pt):
        pt = np.array(pt, dtype=np.float32)
        if idx not in self.state:
            self.state[idx] = pt
        else:
            self.state[idx] = self.alpha * pt + (1.0 - self.alpha) * self.state[idx]
        return [int(self.state[idx][0]), int(self.state[idx][1])]


class ValueSmoother:
    """Smooths displayed angles and symmetry scores so numbers don't flicker."""
    def __init__(self, alpha=0.28):
        self.alpha = alpha
        self.val = None

    def update(self, new_val):
        if self.val is None:
            self.val = float(new_val)
        else:
            self.val = self.alpha * float(new_val) + (1.0 - self.alpha) * self.val
        return int(round(self.val))


def calculate_angle(a, b, c):
    """True 2D vector dot-product angle (0-180 deg) at vertex b"""
    a, b, c = np.array(a, dtype=np.float32), np.array(b, dtype=np.float32), np.array(c, dtype=np.float32)
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba == 0 or norm_bc == 0:
        return 0
    cosine_angle = np.clip(np.dot(ba, bc) / (norm_ba * norm_bc), -1.0, 1.0)
    return int(np.degrees(np.arccos(cosine_angle)))


# ==========================================
# 3. MAIN PHYSIOPULSE ENGINE (8 PROTOCOLS)
# ==========================================
def main():
    global live_telemetry, latest_jpeg_frame, external_action, is_streaming
    parser = argparse.ArgumentParser(description="PhysioPulse AI Vision Engine")
    parser.add_argument("--embedded", action="store_true", default=False, help="Run in embedded web streaming mode (no OpenCV GUI window)")
    parser.add_argument("--port", type=int, default=8000, help="HTTP streaming port")
    args, _ = parser.parse_known_args()

    embedded = args.embedded
    port = args.port

    if embedded:
        try:
            server = http.server.ThreadingHTTPServer(('0.0.0.0', port), VideoStreamHandler)
            server_thread = threading.Thread(target=server.serve_forever, daemon=True)
            server_thread.start()
            print(f"📡 Embedded Vision Streamer active on http://127.0.0.1:{port}/video_feed")
        except Exception as e:
            print(f"⚠️ Warning: Could not bind streaming server to port {port}: {e}")

    base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.65,
        min_pose_presence_confidence=0.65,
        min_tracking_confidence=0.65
    )

    coach = VoiceCoach(cooldown=3.8)
    pt_smoother = LandmarkSmoother(alpha=0.38)
    angle_smoother = ValueSmoother(alpha=0.3)
    sym_smoother = ValueSmoother(alpha=0.25)

    mode_names = {
        1: "P1: Frozen Shoulder Abduction (Seated/Standing)",
        2: "P2: Post-ACL Knee Extension & Squat (Full Body)",
        3: "P3: Cervical & Ergonomic Posture Guard (Seated)",
        4: "P4: Post-Fracture Elbow Flexion Rehab (Seated)",
        5: "P5: Bilateral Overhead Wall-Slide Sync (Dual Arm)",
        6: "P6: Total Hip Replacement Side Abduction (Standing)",
        7: "P7: Lumbar Spine Flexion / Slip-Disc Rehab (Torso)",
        8: "P8: Carpal Tunnel Wrist & Forearm Extension (Seated)"
    }

    # ------------------------------------------
    # 3.1 PRESCRIPTION QUEUE INITIALIZATION
    # ------------------------------------------
    is_prescribed_mode = False
    prescription_queue = []
    patient_name = "Anonymous Patient"
    prescribed_diagnosis = "Physical Therapy & Posture Correction"
    queue_idx = 0

    script_dir = os.path.dirname(os.path.abspath(__file__))
    prescribed_file_path = os.path.join(script_dir, "prescribed_session.json")
    report_file_path = os.path.join(script_dir, "clinical_session_report.json")

    if os.path.exists(prescribed_file_path):
        try:
            with open(prescribed_file_path, "r") as f:
                prescribed_data = json.load(f)
            exercises_in_file = prescribed_data.get("exercises", [])
            if isinstance(exercises_in_file, list) and len(exercises_in_file) > 0:
                prescription_queue = exercises_in_file
                patient_name = prescribed_data.get("patient_name", "Anonymous Patient")
                prescribed_diagnosis = (
                    prescribed_data.get("clinical_diagnosis_summary")
                    or prescribed_data.get("prescribed_diagnosis")
                    or "Physical Therapy Routine"
                )
                is_prescribed_mode = True
                print(f"📋 Loaded AI Prescribed Session: {len(prescription_queue)} exercise(s) for {patient_name}")
        except Exception as e:
            print(f"⚠️ Error reading prescribed_session.json: {e}")
            is_prescribed_mode = False

    if is_prescribed_mode:
        current_ex = prescription_queue[0]
        mode = int(current_ex.get("protocol_id", 1))
        target_reps = int(current_ex.get("target_reps", 5))
        target_rom = int(current_ex.get("target_rom_degrees", 90))
        active_protocol_name = current_ex.get("protocol_name", mode_names.get(mode, f"Protocol {mode}"))
        coach.speak(
            f"Prescribed session loaded. Exercise 1 of {len(prescription_queue)}: {active_protocol_name}. Target: {target_reps} reps.",
            force=True
        )
    else:
        mode = 3  # Default manual: Desk/Cervical Posture mode
        target_reps = 10
        target_rom = 90
        active_protocol_name = mode_names[mode]
        coach.speak("Physio Pulse 8 Protocol Suite initialized.", force=True)

    reps = 0
    stage = "DOWN" if mode not in [2, 7] else "UP"
    max_rom = 0
    bad_frame_streak = 0
    posture_errors = 0
    form_status = "CALIBRATING..."
    feedback_text = "Position yourself in frame to begin..."

    # Multi-Exercise Analytics Tracking
    completed_exercises = []
    current_exercise_start_time = time.monotonic()
    symmetry_samples = []
    compensation_reasons = {}
    p3_hold_timer = 0.0
    last_frame_wall_time = time.monotonic()
    advancing = False
    advance_start_time = 0.0
    advance_delay = 3.0

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    window_name = "PhysioPulse AI - Clinical Vision Engine"
    if not embedded:
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)

    start_time = time.monotonic()
    last_timestamp_ms = -1

    empty_frame_streak = 0
    with vision.PoseLandmarker.create_from_options(options) as landmarker:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                empty_frame_streak += 1
                if empty_frame_streak < 100:
                    time.sleep(0.04)
                    continue
                else:
                    print("⚠️ Camera stream ended.")
                    break
            empty_frame_streak = 0

            now_wall = time.monotonic()
            dt = max(0.001, min(0.2, now_wall - last_frame_wall_time))
            last_frame_wall_time = now_wall

            frame = cv2.flip(frame, 1)
            h, w, _ = frame.shape

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            timestamp_ms = int((time.monotonic() - start_time) * 1000)
            if timestamp_ms <= last_timestamp_ms:
                timestamp_ms = last_timestamp_ms + 1
            last_timestamp_ms = timestamp_ms

            results = landmarker.detect_for_video(mp_image, timestamp_ms)

            primary_angle = 0
            symmetry_score = 100
            is_bad_form = False

            if results.pose_landmarks and len(results.pose_landmarks) > 0:
                lm = results.pose_landmarks[0]

                def get_pt(idx):
                    raw = [lm[idx].x * w, lm[idx].y * h]
                    return pt_smoother.smooth(idx, raw)

                def is_visible(indices, threshold=0.5):
                    return all(lm[i].visibility > threshold for i in indices)

                # Smoothed Anatomical Landmarks (Mirrored View)
                nose       = get_pt(0)
                l_ear      = get_pt(8)
                r_ear      = get_pt(7)
                l_shoulder = get_pt(12)
                r_shoulder = get_pt(11)
                l_elbow    = get_pt(14)
                r_elbow    = get_pt(13)
                l_wrist    = get_pt(16)
                r_wrist    = get_pt(15)
                l_index    = get_pt(20)  # Hand index knuckle for wrist tracking
                l_hip      = get_pt(24)
                l_knee     = get_pt(26)
                l_ankle    = get_pt(28)

                # Scale-invariant reference: Shoulder width in pixels
                shoulder_width = max(40.0, np.linalg.norm(np.array(l_shoulder) - np.array(r_shoulder)))
                shoulder_tilt_ratio = abs(l_shoulder[1] - r_shoulder[1]) / shoulder_width
                raw_sym = max(0, min(100, int(100 - (shoulder_tilt_ratio / 0.22) * 50)))
                symmetry_score = sym_smoother.update(raw_sym)
                symmetry_samples.append(symmetry_score)

                # ====================================================
                # PROTOCOL 1: FROZEN SHOULDER ABDUCTION (Gravity Ref)
                # ====================================================
                if mode == 1:
                    if not is_visible([12, 14, 16], threshold=0.5):
                        form_status = "LOW VISIBILITY"
                        feedback_text = "Keep your left shoulder, elbow, and wrist in frame."
                    else:
                        vertical_ref = [l_shoulder[0], l_shoulder[1] + 200]
                        raw_angle = calculate_angle(vertical_ref, l_shoulder, l_elbow)
                        primary_angle = angle_smoother.update(raw_angle)
                        elbow_straightness = calculate_angle(l_shoulder, l_elbow, l_wrist)

                        if primary_angle > max_rom:
                            max_rom = primary_angle

                        frame_error = False
                        if shoulder_tilt_ratio > 0.16 and primary_angle > 40:
                            frame_error = True
                            err_type = "COMPENSATION: SHRUGGING"
                            err_msg = "Keep shoulders level! Do not shrug."
                        elif elbow_straightness < 135 and primary_angle > 40:
                            frame_error = True
                            err_type = "COMPENSATION: BENT ELBOW"
                            err_msg = "Keep your arm straight as you raise it."

                        if frame_error:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 6:
                                is_bad_form = True
                                form_status = err_type
                                feedback_text = err_msg
                                coach.speak(err_msg)
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "OPTIMAL BIOMECHANICS"
                            feedback_text = f"Raise left arm smoothly (Target: {target_rom} deg)."

                        if primary_angle >= 88 and stage == "DOWN" and not is_bad_form:
                            stage = "UP"
                            reps += 1
                            coach.speak(f"Rep {reps}. {primary_angle} degrees.", force=True)
                        elif primary_angle <= 32 and stage == "UP":
                            stage = "DOWN"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_shoulder), tuple(vertical_ref), (100, 100, 100), 2, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_shoulder), tuple(l_elbow), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_elbow), tuple(l_wrist), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_shoulder), tuple(r_shoulder), (255, 255, 255), 2, cv2.LINE_AA)
                        for pt in [l_shoulder, l_elbow, l_wrist, r_shoulder]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                        cv2.putText(frame, f"{primary_angle} deg", (l_shoulder[0] - 50, l_shoulder[1] - 25),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 2: POST-ACL KNEE FLEXION / SQUAT
                # ====================================================
                elif mode == 2:
                    if not is_visible([24, 26, 28], threshold=0.5):
                        form_status = "STEP BACK FOR FULL BODY"
                        feedback_text = "Stand back so hip, knee, and ankle are visible!"
                    else:
                        raw_angle = calculate_angle(l_hip, l_knee, l_ankle)
                        primary_angle = angle_smoother.update(raw_angle)
                        torso_lean = calculate_angle(l_shoulder, l_hip, l_knee)

                        rom_flexion = max(0, 180 - primary_angle)
                        if rom_flexion > max_rom:
                            max_rom = rom_flexion

                        if torso_lean < 68:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 6:
                                is_bad_form = True
                                form_status = "COMPENSATION: FORWARD LEAN"
                                feedback_text = "Keep your chest upright and spine neutral!"
                                coach.speak("Keep your chest up.")
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "OPTIMAL BIOMECHANICS"
                            feedback_text = "Lower hips until knee reaches 90 degrees."

                        if primary_angle <= 112 and stage == "UP" and not is_bad_form:
                            stage = "DOWN"
                            reps += 1
                            coach.speak(f"Rep {reps}. Good knee flexion.", force=True)
                        elif primary_angle >= 162:
                            stage = "UP"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_shoulder), tuple(l_hip), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_hip), tuple(l_knee), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_knee), tuple(l_ankle), line_color, 4, cv2.LINE_AA)
                        for pt in [l_shoulder, l_hip, l_knee, l_ankle]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                        cv2.putText(frame, f"{primary_angle} deg", (l_knee[0] + 15, l_knee[1]),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 3: CERVICAL & DESK POSTURE GUARD
                # ====================================================
                elif mode == 3:
                    mid_shoulder = [(l_shoulder[0] + r_shoulder[0]) // 2, (l_shoulder[1] + r_shoulder[1]) // 2]
                    vertical_up = [mid_shoulder[0], mid_shoulder[1] - 200]
                    neck_deviation = calculate_angle(vertical_up, mid_shoulder, nose)
                    raw_cervical_score = max(0, 90 - neck_deviation)
                    primary_angle = angle_smoother.update(raw_cervical_score)

                    ear_tilt_ratio = abs(l_ear[1] - r_ear[1]) / shoulder_width
                    max_rom = max(max_rom, symmetry_score)

                    if symmetry_score < 80 or neck_deviation > 14 or ear_tilt_ratio > 0.12:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "POSTURE DRIFT DETECTED"
                            feedback_text = f"Neck tilt: {neck_deviation} deg | Align head & shoulders!"
                            coach.speak("Posture drift detected. Align your neck and shoulders.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        form_status = "ERGONOMIC ALIGNMENT"
                        feedback_text = f"Cervical tilt: {neck_deviation} deg | Hold: {int(p3_hold_timer)}s/15s"
                        # Protocol 3: 15-second good posture hold = 1 completed set
                        p3_hold_timer += dt
                        if p3_hold_timer >= 15.0:
                            reps += 1
                            p3_hold_timer = 0.0
                            coach.speak(f"Set {reps} completed. Alignment held for 15 seconds.", force=True)

                    line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                    cv2.line(frame, tuple(mid_shoulder), tuple(vertical_up), (100, 100, 100), 2, cv2.LINE_AA)
                    cv2.line(frame, tuple(l_shoulder), tuple(r_shoulder), line_color, 4, cv2.LINE_AA)
                    cv2.line(frame, tuple(mid_shoulder), tuple(nose), line_color, 4, cv2.LINE_AA)
                    cv2.line(frame, tuple(l_ear), tuple(r_ear), (255, 255, 255), 2, cv2.LINE_AA)
                    for pt in [l_shoulder, r_shoulder, mid_shoulder, nose, l_ear, r_ear]:
                        cv2.circle(frame, tuple(pt), 7, (0, 255, 255), -1, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 4: POST-FRACTURE ELBOW FLEXION (Seated/Standing)
                # ====================================================
                elif mode == 4:
                    if not is_visible([12, 14, 16], threshold=0.5):
                        form_status = "LOW VISIBILITY"
                        feedback_text = "Keep your left shoulder, elbow, and hand in frame."
                    else:
                        raw_angle = calculate_angle(l_shoulder, l_elbow, l_wrist)
                        primary_angle = angle_smoother.update(raw_angle)

                        vertical_ref = [l_shoulder[0], l_shoulder[1] + 200]
                        upper_arm_drift = calculate_angle(vertical_ref, l_shoulder, l_elbow)

                        rom_flexion = max(0, 180 - primary_angle)
                        if rom_flexion > max_rom:
                            max_rom = rom_flexion

                        if upper_arm_drift > 28:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 6:
                                is_bad_form = True
                                form_status = "COMPENSATION: ELBOW DRIFT"
                                feedback_text = "Pin your elbow close to your ribs! Don't swing."
                                coach.speak("Keep your elbow pinned to your side.")
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "OPTIMAL BIOMECHANICS"
                            feedback_text = "Curl hand upward toward shoulder smoothly."

                        if primary_angle <= 55 and stage == "DOWN" and not is_bad_form:
                            stage = "UP"
                            reps += 1
                            coach.speak(f"Rep {reps}. Full elbow flexion.", force=True)
                        elif primary_angle >= 145 and stage == "UP":
                            stage = "DOWN"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_shoulder), tuple(vertical_ref), (100, 100, 100), 2, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_shoulder), tuple(l_elbow), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_elbow), tuple(l_wrist), line_color, 4, cv2.LINE_AA)
                        for pt in [l_shoulder, l_elbow, l_wrist]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                        cv2.putText(frame, f"{primary_angle} deg", (l_elbow[0] - 60, l_elbow[1] + 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 5: BILATERAL OVERHEAD WALL-SLIDE (Dual Arm)
                # ====================================================
                elif mode == 5:
                    if not is_visible([11, 12, 13, 14], threshold=0.5):
                        form_status = "LOW VISIBILITY"
                        feedback_text = "Keep both shoulders and elbows clearly visible."
                    else:
                        l_vert = [l_shoulder[0], l_shoulder[1] + 200]
                        r_vert = [r_shoulder[0], r_shoulder[1] + 200]
                        l_ang = calculate_angle(l_vert, l_shoulder, l_elbow)
                        r_ang = calculate_angle(r_vert, r_shoulder, r_elbow)

                        primary_angle = angle_smoother.update((l_ang + r_ang) // 2)
                        arm_diff = abs(l_ang - r_ang)
                        symmetry_score = sym_smoother.update(max(0, 100 - int(arm_diff * 1.8)))

                        if primary_angle > max_rom:
                            max_rom = primary_angle

                        if arm_diff > 18 and primary_angle > 45:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 6:
                                is_bad_form = True
                                form_status = f"ASYMMETRY: {arm_diff} DEG GAP"
                                feedback_text = "Raise both arms at the exact same height!"
                                coach.speak("Arm asymmetry detected. Level both arms.")
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "BILATERAL SYNC OPTIMAL"
                            feedback_text = f"L: {l_ang} deg | R: {r_ang} deg (Raise both overhead)"

                        if primary_angle >= 115 and stage == "DOWN" and not is_bad_form:
                            stage = "UP"
                            reps += 1
                            coach.speak(f"Rep {reps}. Great bilateral symmetry.", force=True)
                        elif primary_angle <= 35 and stage == "UP":
                            stage = "DOWN"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_shoulder), tuple(l_elbow), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_elbow), tuple(l_wrist), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(r_shoulder), tuple(r_elbow), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(r_elbow), tuple(r_wrist), line_color, 4, cv2.LINE_AA)
                        for pt in [l_shoulder, l_elbow, l_wrist, r_shoulder, r_elbow, r_wrist]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 6: HIP REPLACEMENT ABDUCTION (Standing)
                # ====================================================
                elif mode == 6:
                    if not is_visible([12, 24, 26, 28], threshold=0.5):
                        form_status = "STEP BACK FOR FULL BODY"
                        feedback_text = "Stand back so hip, knee, and ankle are visible."
                    else:
                        hip_vert = [l_hip[0], l_hip[1] + 200]
                        raw_angle = calculate_angle(hip_vert, l_hip, l_ankle)
                        primary_angle = angle_smoother.update(raw_angle)

                        torso_vert = [l_hip[0], l_hip[1] - 200]
                        trunk_lean = calculate_angle(torso_vert, l_hip, l_shoulder)

                        if primary_angle > max_rom:
                            max_rom = primary_angle

                        if trunk_lean > 16 and primary_angle > 15:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 5:
                                is_bad_form = True
                                form_status = "COMPENSATION: TRUNK LEAN"
                                feedback_text = "Keep upper body vertical! Don't lean sideways."
                                coach.speak("Do not lean your torso sideways.")
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "OPTIMAL PELVIC STABILITY"
                            feedback_text = "Lift leg out to the side (Target: 28+ degrees)."

                        if primary_angle >= 28 and stage == "DOWN" and not is_bad_form:
                            stage = "UP"
                            reps += 1
                            coach.speak(f"Rep {reps}. Good hip stability.", force=True)
                        elif primary_angle <= 10 and stage == "UP":
                            stage = "DOWN"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_hip), tuple(hip_vert), (100, 100, 100), 2, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_shoulder), tuple(l_hip), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_hip), tuple(l_knee), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_knee), tuple(l_ankle), line_color, 4, cv2.LINE_AA)
                        for pt in [l_shoulder, l_hip, l_knee, l_ankle]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 7: LUMBAR SPINE FLEXION / EXTENSION (Torso)
                # Tracks trunk inclination from hip & guards against lateral twisting
                # ====================================================
                elif mode == 7:
                    if not is_visible([11, 12, 24], threshold=0.5):
                        form_status = "SHOW UPPER BODY & HIPS"
                        feedback_text = "Step back slightly so shoulders and hips are in frame."
                    else:
                        torso_vert = [l_hip[0], l_hip[1] - 200]
                        raw_angle = calculate_angle(torso_vert, l_hip, l_shoulder)
                        primary_angle = angle_smoother.update(raw_angle)

                        if primary_angle > max_rom:
                            max_rom = primary_angle

                        if shoulder_tilt_ratio > 0.18 and primary_angle > 15:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 6:
                                is_bad_form = True
                                form_status = "COMPENSATION: SPINAL TWIST"
                                feedback_text = "Keep shoulders square! Do not twist your lower back."
                                coach.speak("Keep your spine symmetrical. Do not twist.")
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "OPTIMAL LUMBAR MECHANICS"
                            feedback_text = "Hinge forward gently to 25+ deg, then return upright."

                        if primary_angle >= 25 and stage == "UP" and not is_bad_form:
                            stage = "DOWN"
                            reps += 1
                            coach.speak(f"Rep {reps}. Return smoothly to neutral.", force=True)
                        elif primary_angle <= 8:
                            stage = "UP"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_hip), tuple(torso_vert), (100, 100, 100), 2, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_hip), tuple(l_shoulder), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_shoulder), tuple(r_shoulder), line_color, 4, cv2.LINE_AA)
                        for pt in [l_hip, l_shoulder, r_shoulder]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                        cv2.putText(frame, f"{primary_angle} deg", (l_hip[0] + 20, l_hip[1] - 20),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)

                # ====================================================
                # PROTOCOL 8: CARPAL TUNNEL WRIST & FOREARM EXTENSION
                # Tracks Elbow -> Wrist -> Index Knuckle + checks shoulder elevation
                # ====================================================
                elif mode == 8:
                    if not is_visible([14, 16, 20], threshold=0.5):
                        form_status = "RAISE FOREARM IN FRAME"
                        feedback_text = "Hold your left forearm and hand clearly in view."
                    else:
                        raw_angle = calculate_angle(l_elbow, l_wrist, l_index)
                        primary_angle = angle_smoother.update(raw_angle)
                        wrist_deviation = abs(180 - primary_angle)

                        if wrist_deviation > max_rom:
                            max_rom = wrist_deviation

                        if shoulder_tilt_ratio > 0.16:
                            bad_frame_streak += 1
                            if bad_frame_streak >= 6:
                                is_bad_form = True
                                form_status = "COMPENSATION: SHOULDER TENSION"
                                feedback_text = "Relax your shoulder down while flexing wrist!"
                                coach.speak("Relax your shoulder while moving your wrist.")
                        else:
                            bad_frame_streak = max(0, bad_frame_streak - 1)
                            form_status = "OPTIMAL TENDON GLIDE"
                            feedback_text = f"Wrist Flex/Ext: {wrist_deviation} deg (Target: 22+ deg)"

                        if wrist_deviation >= 22 and stage == "DOWN" and not is_bad_form:
                            stage = "UP"
                            reps += 1
                            coach.speak(f"Rep {reps}. Good tendon glide.", force=True)
                        elif wrist_deviation <= 8 and stage == "UP":
                            stage = "DOWN"

                        line_color = (0, 0, 255) if is_bad_form else (200, 255, 0)
                        cv2.line(frame, tuple(l_elbow), tuple(l_wrist), line_color, 4, cv2.LINE_AA)
                        cv2.line(frame, tuple(l_wrist), tuple(l_index), line_color, 4, cv2.LINE_AA)
                        for pt in [l_elbow, l_wrist, l_index]:
                            cv2.circle(frame, tuple(pt), 8, (0, 255, 255), -1, cv2.LINE_AA)

                        cv2.putText(frame, f"{wrist_deviation} deg", (l_wrist[0] - 40, l_wrist[1] - 25),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2, cv2.LINE_AA)

                if is_bad_form:
                    posture_errors += 1
                    comp_name = form_status
                    if "ASYMMETRY" in comp_name:
                        comp_name = "COMPENSATION: BILATERAL ASYMMETRY"
                    elif "POSTURE DRIFT" in comp_name:
                        comp_name = "COMPENSATION: POSTURE DRIFT"
                    compensation_reasons[comp_name] = compensation_reasons.get(comp_name, 0) + 1

            # ==========================================
            # 3.2 AUTO-ADVANCE TRIGGER (PRESCRIBED QUEUE)
            # ==========================================
            if is_prescribed_mode and not advancing:
                if reps >= target_reps:
                    advancing = True
                    advance_start_time = time.monotonic()
                    coach.speak("Exercise complete! Advancing in 3 seconds.", force=True)

                    dur = round(time.monotonic() - current_exercise_start_time, 1)
                    mean_sym = int(round(np.mean(symmetry_samples))) if len(symmetry_samples) > 0 else symmetry_score
                    primary_issue = (
                        max(compensation_reasons, key=compensation_reasons.get)
                        if len(compensation_reasons) > 0
                        else "None (Clean Biomechanics)"
                    )
                    completed_exercises.append({
                        "protocol_id": mode,
                        "protocol_name": mode_names.get(mode, f"Protocol {mode}"),
                        "prescribed_reps": target_reps,
                        "completed_reps": reps,
                        "target_rom_degrees": target_rom,
                        "achieved_peak_rom_degrees": max_rom,
                        "mean_symmetry_percent": mean_sym,
                        "compensation_frames_detected": posture_errors,
                        "primary_compensation_issue": primary_issue,
                        "duration_seconds": dur
                    })

            # ==========================================
            # 4. CLINICAL DARK-MODE TELEMETRY HUD
            # ==========================================
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, 0), (w, 75), (14, 18, 22), -1)
            cv2.rectangle(overlay, (20, 95), (430, 420), (16, 20, 24), -1)
            cv2.rectangle(overlay, (20, h - 75), (w - 20, h - 20), (16, 20, 24), -1)
            frame = cv2.addWeighted(overlay, 0.82, frame, 0.18, 0)

            # Top Header Bar
            cv2.putText(frame, "PHYSIOPULSE AI // CLINICAL REHABILITATION SUITE", (25, 28),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 240, 255), 2, cv2.LINE_AA)

            if is_prescribed_mode:
                banner_txt = f"QUEUE: EXERCISE {queue_idx + 1}/{len(prescription_queue)} | TARGET REPS: {reps}/{target_reps} | TARGET ROM: {target_rom} deg"
                cv2.putText(frame, banner_txt, (25, 54),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.52, (200, 255, 0), 2, cv2.LINE_AA)
                nav_txt = "[N] Skip  [Q] Save & Quit"
                cv2.putText(frame, nav_txt, (w - 260, 54),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.50, (180, 180, 180), 1, cv2.LINE_AA)
            else:
                manual_txt = f"{mode_names[mode]}  |  Keys: [1-8] Switch Protocol  [Q] Save & Quit"
                cv2.putText(frame, manual_txt, (25, 54),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.48, (200, 200, 200), 1, cv2.LINE_AA)

            # Left Telemetry Panel
            if is_prescribed_mode:
                cv2.putText(frame, f"REPS COMPLETED : {reps} / {target_reps}", (35, 135),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)
            else:
                cv2.putText(frame, f"REPS COMPLETED : {reps}", (35, 135),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)

            if mode == 3:
                cv2.putText(frame, f"HOLD TIMER     : {min(15.0, p3_hold_timer):.1f}s / 15.0s", (35, 175),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.62, (0, 255, 255), 2, cv2.LINE_AA)
            else:
                cv2.putText(frame, f"JOINT ANGLE    : {primary_angle} deg", (35, 175),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 255), 2, cv2.LINE_AA)

            if is_prescribed_mode:
                cv2.putText(frame, f"PEAK ROM       : {max_rom} deg (Target {target_rom})", (35, 215),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.58, (200, 255, 0), 2, cv2.LINE_AA)
            else:
                cv2.putText(frame, f"PEAK ROM       : {max_rom} deg", (35, 215),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (200, 255, 0), 2, cv2.LINE_AA)

            cv2.putText(frame, f"SYMMETRY SCORE : {symmetry_score}%", (35, 255),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)

            status_color = (0, 0, 255) if is_bad_form else (0, 255, 128)
            cv2.putText(frame, "BIOMECHANICS STATUS:", (35, 305),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (170, 170, 170), 1, cv2.LINE_AA)
            cv2.putText(frame, form_status, (35, 335),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.56, status_color, 2, cv2.LINE_AA)

            if is_prescribed_mode:
                patient_badge = f"PATIENT: {patient_name[:20]}"
                cv2.putText(frame, patient_badge, (35, 385),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.50, (140, 200, 255), 1, cv2.LINE_AA)

            # Bottom AI Coach Banner
            cv2.putText(frame, f"AI COACH: {feedback_text}", (35, h - 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.62, (0, 255, 255), 2, cv2.LINE_AA)

            # Auto-Advance Celebration / Transition Overlay
            if advancing:
                remaining_sec = advance_delay - (time.monotonic() - advance_start_time)
                box_w, box_h = 720, 160
                bx1, by1 = (w - box_w) // 2, (h - box_h) // 2
                cv2.rectangle(frame, (bx1, by1), (bx1 + box_w, by1 + box_h), (14, 34, 22), -1)
                cv2.rectangle(frame, (bx1, by1), (bx1 + box_w, by1 + box_h), (0, 255, 128), 3)
                cv2.putText(frame, "EXERCISE COMPLETE!", (bx1 + 180, by1 + 45),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.95, (0, 255, 128), 2, cv2.LINE_AA)
                cv2.putText(frame, f"Prescription goal met: {reps}/{target_reps} reps | Peak ROM: {max_rom} deg",
                            (bx1 + 65, by1 + 90), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (255, 255, 255), 1, cv2.LINE_AA)
                cv2.putText(frame, f"Advancing to next protocol in {max(1, int(np.ceil(remaining_sec)))} seconds...",
                            (bx1 + 110, by1 + 130), cv2.FONT_HERSHEY_SIMPLEX, 0.68, (0, 255, 255), 2, cv2.LINE_AA)

                if remaining_sec <= 0:
                    queue_idx += 1
                    if queue_idx < len(prescription_queue):
                        current_ex = prescription_queue[queue_idx]
                        mode = int(current_ex.get("protocol_id", 1))
                        target_reps = int(current_ex.get("target_reps", 5))
                        target_rom = int(current_ex.get("target_rom_degrees", 90))
                        active_protocol_name = current_ex.get("protocol_name", mode_names.get(mode, f"Protocol {mode}"))
                        reps = 0
                        max_rom = 0
                        bad_frame_streak = 0
                        posture_errors = 0
                        symmetry_samples = []
                        compensation_reasons = {}
                        p3_hold_timer = 0.0
                        stage = "DOWN" if mode not in [2, 7] else "UP"
                        angle_smoother.val = None
                        current_exercise_start_time = time.monotonic()
                        advancing = False
                        coach.speak(f"Next exercise: {active_protocol_name}. Target: {target_reps} reps.", force=True)
                    else:
                        coach.speak("All prescribed exercises completed! Generating clinical report.", force=True)
                        with stream_lock:
                            live_telemetry["completed"] = True
                            live_telemetry["feedback_text"] = "All exercises complete! Compiling clinical report..."
                        time.sleep(1.0)
                        break

            # Stream latest JPEG frame for embedded web viewing
            ret_enc, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if ret_enc:
                with stream_lock:
                    latest_jpeg_frame = buffer.tobytes()
                    live_telemetry = {
                        "mode": mode,
                        "protocol_name": active_protocol_name,
                        "reps": reps,
                        "target_reps": target_reps,
                        "primary_angle": primary_angle,
                        "max_rom": max_rom,
                        "target_rom": target_rom,
                        "symmetry_score": symmetry_score,
                        "form_status": form_status,
                        "is_bad_form": is_bad_form,
                        "feedback_text": feedback_text,
                        "queue_idx": queue_idx,
                        "total_queue": len(prescription_queue) if is_prescribed_mode else 1,
                        "advancing": advancing,
                        "p3_hold_timer": round(p3_hold_timer, 1),
                        "completed": False
                    }

            global external_action
            if not embedded:
                cv2.imshow(window_name, frame)
                key = cv2.waitKey(10) & 0xFF
            else:
                time.sleep(0.015)
                key = -1
                if external_action == 'quit':
                    key = ord('q')
                    external_action = None
                elif external_action == 'skip':
                    key = ord('n')
                    external_action = None
            if key in [ord('q'), ord('Q')]:
                if not advancing:
                    dur = round(time.monotonic() - current_exercise_start_time, 1)
                    mean_sym = int(round(np.mean(symmetry_samples))) if len(symmetry_samples) > 0 else symmetry_score
                    primary_issue = (
                        max(compensation_reasons, key=compensation_reasons.get)
                        if len(compensation_reasons) > 0
                        else "None (Clean Biomechanics)"
                    )
                    completed_exercises.append({
                        "protocol_id": mode,
                        "protocol_name": mode_names.get(mode, f"Protocol {mode}"),
                        "prescribed_reps": target_reps,
                        "completed_reps": reps,
                        "target_rom_degrees": target_rom,
                        "achieved_peak_rom_degrees": max_rom,
                        "mean_symmetry_percent": mean_sym,
                        "compensation_frames_detected": posture_errors,
                        "primary_compensation_issue": primary_issue,
                        "duration_seconds": dur
                    })
                break
            elif is_prescribed_mode and key in [ord('n'), ord('N')]:
                if not advancing:
                    dur = round(time.monotonic() - current_exercise_start_time, 1)
                    mean_sym = int(round(np.mean(symmetry_samples))) if len(symmetry_samples) > 0 else symmetry_score
                    primary_issue = (
                        max(compensation_reasons, key=compensation_reasons.get)
                        if len(compensation_reasons) > 0
                        else "None (Clean Biomechanics)"
                    )
                    completed_exercises.append({
                        "protocol_id": mode,
                        "protocol_name": mode_names.get(mode, f"Protocol {mode}"),
                        "prescribed_reps": target_reps,
                        "completed_reps": reps,
                        "target_rom_degrees": target_rom,
                        "achieved_peak_rom_degrees": max_rom,
                        "mean_symmetry_percent": mean_sym,
                        "compensation_frames_detected": posture_errors,
                        "primary_compensation_issue": primary_issue,
                        "duration_seconds": dur
                    })
                queue_idx += 1
                if queue_idx < len(prescription_queue):
                    current_ex = prescription_queue[queue_idx]
                    mode = int(current_ex.get("protocol_id", 1))
                    target_reps = int(current_ex.get("target_reps", 5))
                    target_rom = int(current_ex.get("target_rom_degrees", 90))
                    active_protocol_name = current_ex.get("protocol_name", mode_names.get(mode, f"Protocol {mode}"))
                    reps = 0
                    max_rom = 0
                    bad_frame_streak = 0
                    posture_errors = 0
                    symmetry_samples = []
                    compensation_reasons = {}
                    p3_hold_timer = 0.0
                    stage = "DOWN" if mode not in [2, 7] else "UP"
                    angle_smoother.val = None
                    current_exercise_start_time = time.monotonic()
                    advancing = False
                    coach.speak(f"Skipping to exercise {queue_idx + 1}: {active_protocol_name}.", force=True)
                else:
                    coach.speak("Session queue finished. Writing report.", force=True)
                    break
            elif not is_prescribed_mode and key in [ord(str(i)) for i in range(1, 9)]:
                dur = round(time.monotonic() - current_exercise_start_time, 1)
                mean_sym = int(round(np.mean(symmetry_samples))) if len(symmetry_samples) > 0 else symmetry_score
                primary_issue = (
                    max(compensation_reasons, key=compensation_reasons.get)
                    if len(compensation_reasons) > 0
                    else "None (Clean Biomechanics)"
                )
                completed_exercises.append({
                    "protocol_id": mode,
                    "protocol_name": mode_names.get(mode, f"Protocol {mode}"),
                    "prescribed_reps": target_reps,
                    "completed_reps": reps,
                    "target_rom_degrees": target_rom,
                    "achieved_peak_rom_degrees": max_rom,
                    "mean_symmetry_percent": mean_sym,
                    "compensation_frames_detected": posture_errors,
                    "primary_compensation_issue": primary_issue,
                    "duration_seconds": dur
                })
                mode = int(chr(key))
                reps = 0
                max_rom = 0
                bad_frame_streak = 0
                posture_errors = 0
                symmetry_samples = []
                compensation_reasons = {}
                p3_hold_timer = 0.0
                stage = "DOWN" if mode not in [2, 7] else "UP"
                angle_smoother.val = None
                current_exercise_start_time = time.monotonic()
                coach.speak(f"Protocol {mode} activated.", force=True)

    global is_streaming
    is_streaming = False
    cap.release()
    if not embedded:
        cv2.destroyAllWindows()

    # ------------------------------------------
    # 5. RICH MULTI-EXERCISE TELEMETRY JSON EXPORT
    # ------------------------------------------
    if not completed_exercises:
        dur = round(time.monotonic() - current_exercise_start_time, 1)
        mean_sym = int(round(np.mean(symmetry_samples))) if len(symmetry_samples) > 0 else symmetry_score
        primary_issue = (
            max(compensation_reasons, key=compensation_reasons.get)
            if len(compensation_reasons) > 0
            else "None (Clean Biomechanics)"
        )
        completed_exercises.append({
            "protocol_id": mode,
            "protocol_name": mode_names.get(mode, f"Protocol {mode}"),
            "prescribed_reps": target_reps,
            "completed_reps": reps,
            "target_rom_degrees": target_rom,
            "achieved_peak_rom_degrees": max_rom,
            "mean_symmetry_percent": mean_sym,
            "compensation_frames_detected": posture_errors,
            "primary_compensation_issue": primary_issue,
            "duration_seconds": dur
        })

    total_prescribed = sum(ex["prescribed_reps"] for ex in completed_exercises)
    total_completed = sum(ex["completed_reps"] for ex in completed_exercises)
    overall_compliance = int(min(100, round((total_completed / total_prescribed) * 100))) if total_prescribed > 0 else 100

    report = {
        "session_id": f"session_sub_{int(time.time())}",
        "timestamp": datetime.now().isoformat(),
        "patient_name": patient_name,
        "prescribed_diagnosis": prescribed_diagnosis,
        "overall_compliance_percent": overall_compliance,
        "exercises_performed": completed_exercises
    }

    script_dir = os.path.dirname(os.path.abspath(__file__))
    report_file_path = os.path.join(script_dir, "clinical_session_report.json")
    with open(report_file_path, "w") as f:
        json.dump(report, f, indent=4)

    print("✅ Clinical session multi-exercise telemetry successfully written to clinical_session_report.json")
    sys.exit(0)


if __name__ == "__main__":
    main()
