import os
import sys
import argparse
import time
import json
from datetime import datetime
# Guard against Windows Application Control / Smart App Control blocking unused matplotlib DLLs
try:
    import matplotlib
except Exception:
    from unittest.mock import MagicMock
    dummy = MagicMock()
    sys.modules["matplotlib"] = dummy
    sys.modules["matplotlib.pyplot"] = dummy

import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from . import config
from . import state
from .camera import ZeroLatencyCamera
from .audio import VoiceCoach
from .server import start_embedded_server
from .filters.one_euro import PointOneEuroFilter, World3DOneEuroFilter, ValueOneEuroFilter
from .kinematics.angles import calculate_angle_2d
from .rendering.visualizer import draw_ghost_skeleton, draw_desktop_hud
from .protocols.registry import MODE_NAMES, PROTOCOL_GUIDE, REQ_LANDMARKS
from .protocols.base import ProtocolSessionState
from .protocols.evaluator import evaluate_protocol


def run_engine(embedded: bool = False, port: int = config.DEFAULT_PORT, use_high_accuracy: bool = False):
    """Core kinematic intelligence session loop."""
    active_model = config.resolve_model_path(use_high_accuracy=use_high_accuracy)
    print(f"🤖 Active Model Backbone: {os.path.basename(active_model)} ({'High-Accuracy Full Mode' if 'full' in active_model else 'Low-Latency Lite (30+ FPS Mode)'})")

    if embedded:
        start_embedded_server(port=port)

    base_options = python.BaseOptions(model_asset_path=active_model)
    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.65,
        min_pose_presence_confidence=0.65,
        min_tracking_confidence=0.65
    )

    coach = VoiceCoach(cooldown=3.5)
    pt_filter = PointOneEuroFilter(min_cutoff=1.15, beta=0.015)
    world_filter = World3DOneEuroFilter(min_cutoff=0.9, beta=0.01)
    angle_filter = ValueOneEuroFilter(min_cutoff=0.95, beta=0.012)
    sym_filter = ValueOneEuroFilter(min_cutoff=0.8, beta=0.008)

    session_state = ProtocolSessionState()

    # Load prescription queue if available
    is_prescribed_mode = False
    prescription_queue = []
    patient_name = "Anonymous Patient"
    prescribed_diagnosis = "Physical Therapy & Posture Correction"
    queue_idx = 0

    if os.path.exists(config.PRESCRIBED_FILE_PATH):
        try:
            with open(config.PRESCRIBED_FILE_PATH, "r", encoding="utf-8") as f:
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
        active_protocol_name = current_ex.get("protocol_name", MODE_NAMES.get(mode, f"Protocol {mode}"))
        coach.speak(
            f"Prescribed session loaded. Exercise 1 of {len(prescription_queue)}: {active_protocol_name}. Target: {target_reps} reps.",
            force=True
        )
    else:
        mode = 3
        target_reps = 10
        target_rom = 90
        active_protocol_name = MODE_NAMES[mode]
        coach.speak("Physio Pulse 8 Protocol Suite initialized.", force=True)

    session_state.reset_for_protocol(mode)

    calibration_frames = 0
    baseline_calibrated = False
    calib_samples_tilt = []
    calib_samples_neck = []
    baseline_shoulder_tilt = 0.0
    baseline_neck_deviation = 0.0

    completed_exercises = []
    current_exercise_start_time = time.monotonic()
    last_frame_wall_time = time.monotonic()
    advancing = False
    advance_start_time = 0.0
    advance_delay = 3.0

    def reset_exercise_tracking(new_mode):
        nonlocal calibration_frames, baseline_calibrated, calib_samples_tilt, calib_samples_neck
        nonlocal baseline_shoulder_tilt, baseline_neck_deviation, current_exercise_start_time, advancing
        session_state.reset_for_protocol(new_mode)
        angle_filter.f = None
        sym_filter.f = None
        pt_filter.reset()
        world_filter.reset()
        calibration_frames = 0
        baseline_calibrated = False
        calib_samples_tilt.clear()
        calib_samples_neck.clear()
        baseline_shoulder_tilt = 0.0
        baseline_neck_deviation = 0.0
        current_exercise_start_time = time.monotonic()
        advancing = False

    camera = ZeroLatencyCamera(width=config.DEFAULT_FRAME_WIDTH, height=config.DEFAULT_FRAME_HEIGHT)
    window_name = "PhysioPulse AI - Clinical Vision Engine"
    if not embedded:
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)

    start_time = time.monotonic()
    last_timestamp_ms = -1
    fps_history = []
    inf_latency_history = []
    rolling_inf_ms = 0.0
    rolling_fps = 30.0
    loop_count = 0
    prev_loop_time = time.monotonic()

    with vision.PoseLandmarker.create_from_options(options) as landmarker:
        while camera.is_opened() and state.is_streaming:
            ret, frame, frame_capture_time = camera.read_latest()
            if not ret or frame is None:
                time.sleep(0.004)
                continue

            loop_count += 1
            loop_now = time.monotonic()
            fps_dt = max(0.001, loop_now - prev_loop_time)
            prev_loop_time = loop_now
            fps_history.append(1.0 / fps_dt)
            if len(fps_history) > 30:
                fps_history.pop(0)
            rolling_fps = round(float(np.mean(fps_history)), 1)

            now_wall = time.monotonic()
            dt = max(0.001, min(0.2, now_wall - last_frame_wall_time))
            last_frame_wall_time = now_wall

            frame = cv2.flip(frame, 1)
            h, w, _ = frame.shape

            # High-Performance inference downscale (512x288 contiguous buffer)
            inf_frame = cv2.resize(frame, (config.INFERENCE_WIDTH, config.INFERENCE_HEIGHT), interpolation=cv2.INTER_LINEAR)
            rgb_frame = np.ascontiguousarray(cv2.cvtColor(inf_frame, cv2.COLOR_BGR2RGB))
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            timestamp_ms = int((time.monotonic() - start_time) * 1000)
            if timestamp_ms <= last_timestamp_ms:
                timestamp_ms = last_timestamp_ms + 1
            last_timestamp_ms = timestamp_ms

            t_inf_start = time.monotonic()
            results = landmarker.detect_for_video(mp_image, timestamp_ms)
            inf_dur_ms = (time.monotonic() - t_inf_start) * 1000.0
            inf_latency_history.append(inf_dur_ms)
            if len(inf_latency_history) > 30:
                inf_latency_history.pop(0)
            rolling_inf_ms = round(float(np.mean(inf_latency_history)), 1)

            primary_angle = 0

            if results.pose_landmarks and len(results.pose_landmarks) > 0:
                lm = results.pose_landmarks[0]
                world_lm = results.pose_world_landmarks[0] if (results.pose_world_landmarks and len(results.pose_world_landmarks) > 0) else None

                all_pts = {}
                for idx in config.ACTIVE_LANDMARK_INDICES:
                    raw = [lm[idx].x * w, lm[idx].y * h]
                    all_pts[idx] = pt_filter.smooth(idx, raw, now_wall)

                if state.show_skeleton:
                    draw_ghost_skeleton(frame, all_pts)

                def is_visible(indices, threshold=0.40):
                    for i in indices:
                        if i >= len(lm):
                            return False
                        v = getattr(lm[i], 'visibility', None)
                        if v is not None and v < threshold:
                            return False
                    return True

                nose       = all_pts[0]
                l_shoulder = all_pts[12]
                r_shoulder = all_pts[11]

                shoulder_width = max(40.0, np.linalg.norm(np.array(l_shoulder) - np.array(r_shoulder)))
                shoulder_tilt_ratio = abs(l_shoulder[1] - r_shoulder[1]) / shoulder_width

                needed_indices = REQ_LANDMARKS.get(mode, [11, 12])
                tracking_visible = is_visible(needed_indices, threshold=0.38)
                hips_clearly_visible = is_visible([23, 24], threshold=0.65)

                # Neutral calibration routine (22 frames ~ 0.6s)
                if not baseline_calibrated and tracking_visible:
                    calibration_frames += 1
                    calib_samples_tilt.append(shoulder_tilt_ratio)
                    mid_sh_c = [(l_shoulder[0] + r_shoulder[0]) / 2, (l_shoulder[1] + r_shoulder[1]) / 2]
                    vert_up_c = [mid_sh_c[0], mid_sh_c[1] - 200]
                    curr_neck_dev = calculate_angle_2d(vert_up_c, mid_sh_c, nose)
                    calib_samples_neck.append(curr_neck_dev)

                    session_state.form_status = "CALIBRATING ZERO-POINT..."
                    session_state.feedback_text = f"Hold neutral posture ({min(100, int(calibration_frames / 22 * 100))}%)..."

                    if calibration_frames >= 22:
                        baseline_shoulder_tilt = float(np.median(calib_samples_tilt)) if calib_samples_tilt else 0.0
                        baseline_neck_deviation = float(np.median(calib_samples_neck)) if calib_samples_neck else 0.0
                        baseline_calibrated = True
                        session_state.form_status = "OPTIMAL BIOMECHANICS"
                        session_state.feedback_text = "Baseline calibrated! Begin exercise."
                        coach.speak("Calibrated. Begin exercise.", force=True)

                relative_tilt = max(0.0, shoulder_tilt_ratio - baseline_shoulder_tilt) if baseline_calibrated else 0.0
                raw_sym = max(0, min(100, int(100 - (relative_tilt / 0.22) * 50)))
                session_state.symmetry_score = sym_filter.update(raw_sym, now_wall)
                session_state.symmetry_samples.append(session_state.symmetry_score)
                if len(session_state.symmetry_samples) > 600:
                    session_state.symmetry_samples.pop(0)

                if not tracking_visible:
                    session_state.form_status = "ADJUST POSITION"
                    session_state.feedback_text = "Ensure target joints are clearly visible in camera frame."

                primary_angle = evaluate_protocol(
                    mode=mode,
                    frame=frame,
                    all_pts=all_pts,
                    world_lm=world_lm,
                    world_filter=world_filter,
                    angle_filter=angle_filter,
                    sym_filter=sym_filter,
                    now_wall=now_wall,
                    dt=dt,
                    target_rom=target_rom,
                    baseline_calibrated=baseline_calibrated,
                    relative_tilt=relative_tilt,
                    baseline_neck_deviation=baseline_neck_deviation,
                    shoulder_width=shoulder_width,
                    hips_clearly_visible=hips_clearly_visible,
                    coach=coach,
                    show_skeleton=state.show_skeleton,
                    state=session_state
                )

            # Prescribed queue auto-advance trigger
            if is_prescribed_mode and not advancing:
                if session_state.reps >= target_reps:
                    advancing = True
                    advance_start_time = time.monotonic()
                    coach.speak("Exercise complete! Advancing in 3 seconds.", force=True)

                    dur = round(time.monotonic() - current_exercise_start_time, 1)
                    mean_sym = int(round(np.mean(session_state.symmetry_samples))) if len(session_state.symmetry_samples) > 0 else session_state.symmetry_score
                    primary_issue = (
                        max(session_state.compensation_reasons, key=session_state.compensation_reasons.get)
                        if len(session_state.compensation_reasons) > 0
                        else "None (Clean Biomechanics)"
                    )
                    completed_exercises.append({
                        "protocol_id": mode,
                        "protocol_name": MODE_NAMES.get(mode, f"Protocol {mode}"),
                        "prescribed_reps": target_reps,
                        "completed_reps": session_state.reps,
                        "target_rom_degrees": target_rom,
                        "achieved_peak_rom_degrees": session_state.max_rom,
                        "mean_symmetry_percent": mean_sym,
                        "compensation_frames_detected": session_state.posture_errors,
                        "primary_compensation_issue": primary_issue,
                        "duration_seconds": dur
                    })

            # Auto-advance transition countdown
            remaining_sec = 0.0
            if advancing:
                remaining_sec = advance_delay - (time.monotonic() - advance_start_time)
                if remaining_sec <= 0:
                    queue_idx += 1
                    if queue_idx < len(prescription_queue):
                        current_ex = prescription_queue[queue_idx]
                        mode = int(current_ex.get("protocol_id", 1))
                        target_reps = int(current_ex.get("target_reps", 5))
                        target_rom = int(current_ex.get("target_rom_degrees", 90))
                        active_protocol_name = current_ex.get("protocol_name", MODE_NAMES.get(mode, f"Protocol {mode}"))
                        reset_exercise_tracking(mode)
                        coach.speak(f"Next exercise: {active_protocol_name}. Target: {target_reps} reps.", force=True)
                    else:
                        coach.speak("All prescribed exercises completed! Generating clinical report.", force=True)
                        state.update_telemetry({
                            **state.get_telemetry(),
                            "completed": True,
                            "feedback_text": "All exercises complete! Compiling clinical report..."
                        })
                        time.sleep(1.0)
                        break

            cur_guide = PROTOCOL_GUIDE.get(mode, {
                "title": active_protocol_name,
                "short_name": active_protocol_name,
                "joint": "Target Articulation",
                "setup": "Position body in camera view.",
                "action": "Perform prescribed motion smoothly.",
                "avoid": "Maintain clean alignment.",
                "camera_view": "Front View"
            })

            # Gated On-Demand JPEG Encoding
            needs_jpeg = (embedded and (state.active_stream_clients > 0 or (now_wall - state.last_snapshot_time < 3.0))) or not embedded
            if needs_jpeg:
                stream_out = frame if frame.shape[1] <= 854 else cv2.resize(frame, (config.DEFAULT_FRAME_WIDTH, config.DEFAULT_FRAME_HEIGHT))
                ret_enc, buffer = cv2.imencode('.jpg', stream_out, [cv2.IMWRITE_JPEG_QUALITY, config.DEFAULT_JPEG_QUALITY])
                if ret_enc:
                    state.update_jpeg_frame(buffer.tobytes())

            capture_latency_ms = round((time.monotonic() - frame_capture_time) * 1000, 1)
            telemetry_snapshot = {
                "mode": mode,
                "protocol_name": active_protocol_name,
                "exercise_title": cur_guide["title"],
                "exercise_short_name": cur_guide["short_name"],
                "target_joint": cur_guide["joint"],
                "setup_instruction": cur_guide["setup"],
                "action_instruction": cur_guide["action"],
                "form_tip": cur_guide["avoid"],
                "camera_view": cur_guide["camera_view"],
                "reps": session_state.reps,
                "target_reps": target_reps,
                "primary_angle": primary_angle,
                "max_rom": session_state.max_rom,
                "target_rom": target_rom,
                "symmetry_score": session_state.symmetry_score,
                "form_status": session_state.form_status,
                "is_bad_form": session_state.is_bad_form,
                "feedback_text": session_state.feedback_text,
                "correction_cue": session_state.active_correction_cue,
                "correction_direction": session_state.active_correction_direction,
                "queue_idx": queue_idx,
                "total_queue": len(prescription_queue) if is_prescribed_mode else 1,
                "advancing": advancing,
                "remaining_advance_sec": max(0, round(remaining_sec, 1)) if advancing else 0,
                "p3_hold_timer": round(session_state.p3_hold_timer, 1),
                "angular_velocity": session_state.angular_velocity,
                "kinematic_phase": session_state.kinematic_phase,
                "show_skeleton": state.show_skeleton,
                "patient_name": patient_name,
                "fps": rolling_fps,
                "inference_ms": rolling_inf_ms,
                "latency_ms": capture_latency_ms,
                "completed": False
            }
            state.update_telemetry(telemetry_snapshot)

            if loop_count % 90 == 0:
                print(f"⚡ [Performance Telemetry] FPS: {rolling_fps:.1f} | Inference: {rolling_inf_ms:.1f}ms | Capture-to-Output: {capture_latency_ms:.1f}ms | Clients: {state.active_stream_clients}")

            if not embedded:
                disp_frame = frame.copy()
                hud_title = f"EXERCISE {queue_idx + 1}/{(len(prescription_queue) if is_prescribed_mode else 1)}: {cur_guide['title']} ({cur_guide['joint']})"
                draw_desktop_hud(disp_frame, hud_title, cur_guide['action'], session_state.reps, target_reps, primary_angle, target_rom, rolling_fps)
                cv2.imshow(window_name, disp_frame)
                key = cv2.waitKey(1) & 0xFF
            else:
                key = -1
                action = state.pop_external_action()
                if action == 'quit':
                    key = ord('q')
                elif action == 'skip':
                    key = ord('n')

            if key in [ord('q'), ord('Q')]:
                if not advancing:
                    dur = round(time.monotonic() - current_exercise_start_time, 1)
                    mean_sym = int(round(np.mean(session_state.symmetry_samples))) if len(session_state.symmetry_samples) > 0 else session_state.symmetry_score
                    primary_issue = (
                        max(session_state.compensation_reasons, key=session_state.compensation_reasons.get)
                        if len(session_state.compensation_reasons) > 0
                        else "None (Clean Biomechanics)"
                    )
                    completed_exercises.append({
                        "protocol_id": mode,
                        "protocol_name": MODE_NAMES.get(mode, f"Protocol {mode}"),
                        "prescribed_reps": target_reps,
                        "completed_reps": session_state.reps,
                        "target_rom_degrees": target_rom,
                        "achieved_peak_rom_degrees": session_state.max_rom,
                        "mean_symmetry_percent": mean_sym,
                        "compensation_frames_detected": session_state.posture_errors,
                        "primary_compensation_issue": primary_issue,
                        "duration_seconds": dur
                    })
                break
            elif is_prescribed_mode and key in [ord('n'), ord('N')]:
                if not advancing:
                    dur = round(time.monotonic() - current_exercise_start_time, 1)
                    mean_sym = int(round(np.mean(session_state.symmetry_samples))) if len(session_state.symmetry_samples) > 0 else session_state.symmetry_score
                    primary_issue = (
                        max(session_state.compensation_reasons, key=session_state.compensation_reasons.get)
                        if len(session_state.compensation_reasons) > 0
                        else "None (Clean Biomechanics)"
                    )
                    completed_exercises.append({
                        "protocol_id": mode,
                        "protocol_name": MODE_NAMES.get(mode, f"Protocol {mode}"),
                        "prescribed_reps": target_reps,
                        "completed_reps": session_state.reps,
                        "target_rom_degrees": target_rom,
                        "achieved_peak_rom_degrees": session_state.max_rom,
                        "mean_symmetry_percent": mean_sym,
                        "compensation_frames_detected": session_state.posture_errors,
                        "primary_compensation_issue": primary_issue,
                        "duration_seconds": dur
                    })
                queue_idx += 1
                if queue_idx < len(prescription_queue):
                    current_ex = prescription_queue[queue_idx]
                    mode = int(current_ex.get("protocol_id", 1))
                    target_reps = int(current_ex.get("target_reps", 5))
                    target_rom = int(current_ex.get("target_rom_degrees", 90))
                    active_protocol_name = current_ex.get("protocol_name", MODE_NAMES.get(mode, f"Protocol {mode}"))
                    reset_exercise_tracking(mode)
                    coach.speak(f"Skipping to exercise {queue_idx + 1}: {active_protocol_name}.", force=True)
                else:
                    coach.speak("Session queue finished. Writing report.", force=True)
                    break
            elif not is_prescribed_mode and key in [ord(str(i)) for i in range(1, 9)]:
                dur = round(time.monotonic() - current_exercise_start_time, 1)
                mean_sym = int(round(np.mean(session_state.symmetry_samples))) if len(session_state.symmetry_samples) > 0 else session_state.symmetry_score
                primary_issue = (
                    max(session_state.compensation_reasons, key=session_state.compensation_reasons.get)
                    if len(session_state.compensation_reasons) > 0
                    else "None (Clean Biomechanics)"
                )
                completed_exercises.append({
                    "protocol_id": mode,
                    "protocol_name": MODE_NAMES.get(mode, f"Protocol {mode}"),
                    "prescribed_reps": target_reps,
                    "completed_reps": session_state.reps,
                    "target_rom_degrees": target_rom,
                    "achieved_peak_rom_degrees": session_state.max_rom,
                    "mean_symmetry_percent": mean_sym,
                    "compensation_frames_detected": session_state.posture_errors,
                    "primary_compensation_issue": primary_issue,
                    "duration_seconds": dur
                })
                mode = int(chr(key))
                reset_exercise_tracking(mode)
                coach.speak(f"Protocol {mode} activated.", force=True)

    state.is_streaming = False
    camera.release()
    if not embedded:
        cv2.destroyAllWindows()

    # Compile and export session report
    if not completed_exercises:
        dur = round(time.monotonic() - current_exercise_start_time, 1)
        mean_sym = int(round(np.mean(session_state.symmetry_samples))) if len(session_state.symmetry_samples) > 0 else session_state.symmetry_score
        primary_issue = (
            max(session_state.compensation_reasons, key=session_state.compensation_reasons.get)
            if len(session_state.compensation_reasons) > 0
            else "None (Clean Biomechanics)"
        )
        completed_exercises.append({
            "protocol_id": mode,
            "protocol_name": MODE_NAMES.get(mode, f"Protocol {mode}"),
            "prescribed_reps": target_reps,
            "completed_reps": session_state.reps,
            "target_rom_degrees": target_rom,
            "achieved_peak_rom_degrees": session_state.max_rom,
            "mean_symmetry_percent": mean_sym,
            "compensation_frames_detected": session_state.posture_errors,
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

    with open(config.REPORT_FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=4)

    print("✅ Clinical session multi-exercise telemetry successfully written to clinical_session_report.json")


def main():
    parser = argparse.ArgumentParser(description="PhysioPulse AI Vision Engine")
    parser.add_argument("--embedded", action="store_true", default=False, help="Run in embedded web streaming mode")
    parser.add_argument("--port", type=int, default=config.DEFAULT_PORT, help="HTTP streaming port")
    parser.add_argument("--high-accuracy", action="store_true", default=False, help="Opt-in to High-Accuracy Full Pose model (~50ms CPU)")
    args, _ = parser.parse_known_args()

    use_high_acc = args.high_accuracy or os.environ.get("PHYSIOPULSE_HIGH_ACCURACY", "0").lower() in ("1", "true", "yes")
    run_engine(embedded=args.embedded, port=args.port, use_high_accuracy=use_high_acc)


if __name__ == "__main__":
    main()
