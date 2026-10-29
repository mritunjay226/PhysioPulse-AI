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
import queue
import time
import json
from datetime import datetime

# =========================================================================
# 0. MODEL INITIALIZATION (High-Accuracy FULL Model Preferred)
# =========================================================================
FULL_MODEL_PATH = "pose_landmarker_full.task"
LITE_MODEL_PATH = "pose_landmarker_lite.task"
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task"

if os.path.exists(FULL_MODEL_PATH):
    MODEL_PATH = FULL_MODEL_PATH
elif os.path.exists(LITE_MODEL_PATH):
    MODEL_PATH = LITE_MODEL_PATH
else:
    MODEL_PATH = FULL_MODEL_PATH
    print("⏳ Downloading MediaPipe High-Accuracy Full Pose model (~9.4 MB)...")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    print("✅ Model downloaded!")


# =========================================================================
# 0.1 EMBEDDED WEB STREAMING SERVER
# =========================================================================
def _generate_init_frame():
    try:
        img = np.zeros((480, 848, 3), dtype=np.uint8)
        img[:] = (18, 18, 21)
        ret, buf = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 80])
        return buf.tobytes() if ret else None
    except Exception:
        return None

latest_jpeg_frame = _generate_init_frame()
latest_frame_id = 0
stream_lock = threading.Lock()
new_frame_condition = threading.Condition(stream_lock)
active_stream_token = 0.0
is_streaming = True
external_action = None  # 'skip' or 'quit'
show_skeleton = True    # Toggleable via frontend
live_telemetry = {}


class ZeroLatencyCamera:
    """Dedicated background capture thread that continuously drains Windows DirectShow buffers.
    Guarantees 0ms latency drift indefinitely by always delivering the absolute latest sensor frame."""
    def __init__(self, width=848, height=480):
        self.width = width
        self.height = height
        self.cap = None
        self.frame = None
        self.ret = False
        self.lock = threading.Lock()
        self.new_frame_event = threading.Event()
        self.running = True
        self.frame_count = 0
        self.last_capture_time = time.monotonic()
        self._init_camera()

        if self.cap and self.cap.isOpened():
            self.thread = threading.Thread(target=self._capture_worker, daemon=True)
            self.thread.start()

    def _init_camera(self):
        for cam_idx in [0, 1]:
            try:
                c = cv2.VideoCapture(cam_idx, cv2.CAP_DSHOW)
                if c.isOpened():
                    c.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
                    c.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
                    c.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
                    c.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    ret_t, frame_t = c.read()
                    if ret_t and frame_t is not None:
                        self.cap = c
                        self.frame = frame_t
                        self.ret = True
                        print(f"✅ ZeroLatencyCamera initialized on DirectShow index {cam_idx} ({frame_t.shape[1]}x{frame_t.shape[0]})")
                        return
                    c.release()
            except Exception:
                pass

            try:
                c = cv2.VideoCapture(cam_idx)
                if c.isOpened():
                    c.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
                    c.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
                    c.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    ret_t, frame_t = c.read()
                    if ret_t and frame_t is not None:
                        self.cap = c
                        self.frame = frame_t
                        self.ret = True
                        print(f"✅ ZeroLatencyCamera initialized on default backend index {cam_idx} ({frame_t.shape[1]}x{frame_t.shape[0]})")
                        return
                    c.release()
            except Exception:
                pass

        print("❌ Warning: Falling back to camera 0.")
        self.cap = cv2.VideoCapture(0)
        if self.cap.isOpened():
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    def _capture_worker(self):
        empty_streak = 0
        while self.running:
            if not self.cap or not self.cap.isOpened():
                time.sleep(0.02)
                continue
            ret = self.cap.grab()
            if not ret:
                empty_streak += 1
                time.sleep(0.03 if empty_streak > 60 else 0.002)
                continue
            empty_streak = 0
            ret, frame = self.cap.retrieve()
            if not ret or frame is None:
                continue
            with self.lock:
                self.frame = frame
                self.ret = ret
                self.frame_count += 1
                self.last_capture_time = time.monotonic()
            self.new_frame_event.set()

    def read_latest(self, wait_timeout=0.04):
        self.new_frame_event.wait(timeout=wait_timeout)
        self.new_frame_event.clear()
        with self.lock:
            if self.frame is None:
                return False, None, 0.0
            return self.ret, self.frame.copy(), self.last_capture_time

    def is_opened(self):
        return self.cap is not None and self.cap.isOpened()

    def release(self):
        self.running = False
        self.new_frame_event.set()
        try:
            if hasattr(self, 'thread') and self.thread.is_alive():
                self.thread.join(timeout=1.0)
        except Exception:
            pass
        if self.cap:
            self.cap.release()


class VideoStreamHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, format, *args):
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        self.send_header('Connection', 'keep-alive')
        self.send_header('Keep-Alive', 'timeout=5, max=1000')
        self.end_headers()

    def do_GET(self):
        global latest_jpeg_frame, stream_lock, is_streaming, external_action, live_telemetry, active_stream_token, new_frame_condition, show_skeleton

        if self.path.startswith('/video_feed'):
            import socket
            try:
                self.connection.settimeout(2.0)
                self.connection.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                self.connection.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 32768)
            except Exception:
                pass

            my_token = time.time()
            with stream_lock:
                active_stream_token = my_token

            self.send_response(200)
            self.send_header('Age', '0')
            self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()

            last_sent_id = -1
            while is_streaming:
                frame_bytes = None
                with stream_lock:
                    if active_stream_token != my_token or not is_streaming:
                        break
                    while latest_frame_id == last_sent_id and is_streaming and active_stream_token == my_token:
                        new_frame_condition.wait(timeout=0.04)
                    if active_stream_token != my_token or not is_streaming:
                        break
                    frame_bytes = latest_jpeg_frame
                    last_sent_id = latest_frame_id

                if frame_bytes is not None:
                    try:
                        header = f"--frame\r\nContent-Type: image/jpeg\r\nContent-Length: {len(frame_bytes)}\r\n\r\n".encode('ascii')
                        self.wfile.write(header)
                        self.wfile.write(frame_bytes)
                        self.wfile.write(b'\r\n')
                        self.wfile.flush()
                    except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, TimeoutError, OSError):
                        break
                    except Exception:
                        break

        elif self.path.startswith('/snapshot') or self.path.startswith('/frame.jpg'):
            with stream_lock:
                frame_bytes = latest_jpeg_frame
            if frame_bytes:
                self.send_response(200)
                self.send_header('Content-Type', 'image/jpeg')
                self.send_header('Content-Length', str(len(frame_bytes)))
                self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-age=0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'keep-alive')
                self.send_header('Keep-Alive', 'timeout=5, max=1000')
                self.end_headers()
                try:
                    self.wfile.write(frame_bytes)
                except Exception:
                    pass
            else:
                self.send_response(503)
                self.send_header('Content-Length', '0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'keep-alive')
                self.end_headers()

        elif self.path.startswith('/status'):
            with stream_lock:
                status_json = json.dumps(live_telemetry).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(status_json)))
            self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-age=0')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(status_json)
            except Exception:
                pass

        elif self.path.startswith('/skip'):
            external_action = 'skip'
            resp = b'{"status":"skipping"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(resp)
            except Exception:
                pass

        elif self.path.startswith('/toggle_skeleton'):
            show_skeleton = not show_skeleton
            resp = json.dumps({"status": "ok", "show_skeleton": show_skeleton}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(resp)
            except Exception:
                pass

        elif self.path.startswith('/quit'):
            external_action = 'quit'
            resp = b'{"status":"quitting"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(resp)
            except Exception:
                pass

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        global external_action, show_skeleton
        if self.path.startswith('/toggle_skeleton'):
            show_skeleton = not show_skeleton
            resp = json.dumps({"status": "ok", "show_skeleton": show_skeleton}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(resp)
        elif self.path.startswith('/skip'):
            external_action = 'skip'
            resp = b'{"status":"skipping"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(resp)
        elif self.path.startswith('/quit'):
            external_action = 'quit'
            resp = b'{"status":"quitting"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(resp)
        else:
            self.send_response(404)
            self.end_headers()


# =========================================================================
# 1. NON-BLOCKING VOICE COACH ENGINE
# =========================================================================
class VoiceCoach:
    """Zero-lag persistent TTS worker thread with bounded queue."""
    def __init__(self, cooldown=2.8):
        self.cooldown = cooldown
        self.last_spoken = 0
        self.speech_queue = queue.Queue(maxsize=1)
        self.worker = threading.Thread(target=self._tts_worker, daemon=True)
        self.worker.start()

    def speak(self, text, force=False):
        now = time.monotonic()
        if not force and (now - self.last_spoken < self.cooldown):
            return
        self.last_spoken = now
        try:
            self.speech_queue.get_nowait()
        except queue.Empty:
            pass
        try:
            self.speech_queue.put_nowait(text)
        except queue.Full:
            pass

    def _tts_worker(self):
        try:
            import pythoncom
            pythoncom.CoInitialize()
        except Exception:
            pass
        engine = None
        try:
            engine = pyttsx3.init()
            engine.setProperty('rate', 180)
        except Exception:
            pass

        while True:
            try:
                text = self.speech_queue.get()
                if engine and text:
                    engine.say(text)
                    engine.runAndWait()
            except Exception:
                pass


# =========================================================================
# 2. ADAPTIVE ONE-EURO ($1€$) FILTER & Z-DAMPENED 2D/3D FUSION MATH
# =========================================================================
class OneEuroFilter:
    """Adaptive 1-Euro Filter: Zero jitter when stationary, zero phase lag when moving."""
    def __init__(self, t0, x0, min_cutoff=1.0, beta=0.007, d_cutoff=1.0):
        self.min_cutoff = float(min_cutoff)
        self.beta = float(beta)
        self.d_cutoff = float(d_cutoff)
        self.x_prev = float(x0)
        self.dx_prev = 0.0
        self.t_prev = float(t0)

    def filter(self, t, x):
        t_e = max(1e-4, t - self.t_prev)
        a_d = self._smoothing_factor(t_e, self.d_cutoff)
        dx = (x - self.x_prev) / t_e
        dx_hat = a_d * dx + (1.0 - a_d) * self.dx_prev
        cutoff = self.min_cutoff + self.beta * abs(dx_hat)
        a = self._smoothing_factor(t_e, cutoff)
        x_hat = a * x + (1.0 - a) * self.x_prev
        self.x_prev = x_hat
        self.dx_prev = dx_hat
        self.t_prev = t
        return x_hat

    @staticmethod
    def _smoothing_factor(t_e, cutoff):
        r = 2 * np.pi * cutoff * t_e
        return r / (r + 1.0)


class PointOneEuroFilter:
    """Adaptive 1-Euro 2D landmark filter with sub-pixel float precision."""
    def __init__(self, min_cutoff=1.15, beta=0.015, d_cutoff=1.0):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.d_cutoff = d_cutoff
        self.filters = {}

    def smooth(self, idx, pt, t):
        x, y = float(pt[0]), float(pt[1])
        if idx not in self.filters:
            self.filters[idx] = (
                OneEuroFilter(t, x, self.min_cutoff, self.beta, self.d_cutoff),
                OneEuroFilter(t, y, self.min_cutoff, self.beta, self.d_cutoff)
            )
            return [x, y]
        fx, fy = self.filters[idx]
        return [fx.filter(t, x), fy.filter(t, y)]

    def reset(self):
        self.filters.clear()


class World3DOneEuroFilter:
    """Adaptive 1-Euro 3D metric world landmark filter with Z-depth stabilization."""
    def __init__(self, min_cutoff=0.9, beta=0.01, d_cutoff=1.0):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.d_cutoff = d_cutoff
        self.filters = {}

    def smooth(self, idx, w_lm, t):
        x, y, z = float(w_lm.x), float(w_lm.y), float(w_lm.z)
        if idx not in self.filters:
            self.filters[idx] = (
                OneEuroFilter(t, x, self.min_cutoff, self.beta, self.d_cutoff),
                OneEuroFilter(t, y, self.min_cutoff, self.beta, self.d_cutoff),
                OneEuroFilter(t, z, self.min_cutoff * 0.65, self.beta * 0.5, self.d_cutoff)
            )
            return np.array([x, y, z], dtype=np.float32)
        fx, fy, fz = self.filters[idx]
        return np.array([fx.filter(t, x), fy.filter(t, y), fz.filter(t, z)], dtype=np.float32)

    def reset(self):
        self.filters.clear()


class ValueOneEuroFilter:
    """Adaptive 1-Euro continuous angle & symmetry filter."""
    def __init__(self, min_cutoff=0.95, beta=0.012):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.f = None

    def update(self, val, t):
        val = float(val)
        if self.f is None:
            self.f = OneEuroFilter(t, val, self.min_cutoff, self.beta)
            return int(round(val))
        return int(round(self.f.filter(t, val)))


def calculate_angle_2d(a, b, c):
    """2D vector dot-product angle (0-180 deg) at vertex b with floating-point precision."""
    a, b, c = np.array(a, dtype=np.float32), np.array(b, dtype=np.float32), np.array(c, dtype=np.float32)
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba < 1e-6 or norm_bc < 1e-6:
        return 0.0
    cos_angle = np.clip(np.dot(ba, bc) / (norm_ba * norm_bc), -1.0, 1.0)
    return float(np.degrees(np.arccos(cos_angle)))


def calculate_angle_3d_vec(va, vb, vc, z_weight=0.55):
    """True 3D Euclidean angle in degrees with Z-depth noise dampening for monocular webcams."""
    a = np.array([va[0], va[1], va[2] * z_weight], dtype=np.float32)
    b = np.array([vb[0], vb[1], vb[2] * z_weight], dtype=np.float32)
    c = np.array([vc[0], vc[1], vc[2] * z_weight], dtype=np.float32)
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba < 1e-6 or norm_bc < 1e-6:
        return 0.0
    cos_angle = np.clip(np.dot(ba, bc) / (norm_ba * norm_bc), -1.0, 1.0)
    return float(np.degrees(np.arccos(cos_angle)))


def get_fused_angle(world_lm, world_filter, now_t, pt_a_2d, pt_b_2d, pt_c_2d, idx_a, idx_b, idx_c):
    """Blends smoothed 2D screen geometry with smoothed, Z-dampened 3D world geometry."""
    ang_2d = calculate_angle_2d(pt_a_2d, pt_b_2d, pt_c_2d)
    if not world_lm or max(idx_a, idx_b, idx_c) >= len(world_lm):
        return ang_2d
    wa, wb, wc = world_lm[idx_a], world_lm[idx_b], world_lm[idx_c]
    v_min = min(
        getattr(wa, 'visibility', 1.0) or 1.0,
        getattr(wb, 'visibility', 1.0) or 1.0,
        getattr(wc, 'visibility', 1.0) or 1.0
    )
    if v_min < 0.45:
        return ang_2d
    va = world_filter.smooth(idx_a, wa, now_t)
    vb = world_filter.smooth(idx_b, wb, now_t)
    vc = world_filter.smooth(idx_c, wc, now_t)
    ang_3d = calculate_angle_3d_vec(va, vb, vc, z_weight=0.55)
    return 0.62 * ang_2d + 0.38 * ang_3d


def _pt_i(pt):
    return (int(round(float(pt[0]))), int(round(float(pt[1]))))


# =========================================================================
# 2.1 HIGH-TECH CLINICAL VISUAL RENDERING SYSTEM
# =========================================================================
def draw_clinical_bone(img, pt1, pt2, color=(0, 240, 200), thickness=3, glow_ratio=0.42):
    p1 = _pt_i(pt1)
    p2 = _pt_i(pt2)
    glow_col = (color[0] // 3, color[1] // 3, color[2] // 3)
    cv2.line(img, p1, p2, glow_col, thickness * 2 + 2, cv2.LINE_AA)
    cv2.line(img, p1, p2, color, thickness, cv2.LINE_AA)
    cv2.line(img, p1, p2, (255, 255, 255), max(1, thickness - 2), cv2.LINE_AA)


def draw_clinical_joint(img, pt, color=(0, 240, 200), radius=7):
    p = _pt_i(pt)
    glow_col = (color[0] // 3, color[1] // 3, color[2] // 3)
    cv2.circle(img, p, radius + 4, glow_col, 2, cv2.LINE_AA)
    cv2.circle(img, p, radius, color, -1, cv2.LINE_AA)
    cv2.circle(img, p, max(2, radius - 3), (255, 255, 255), -1, cv2.LINE_AA)


def draw_goniometer_arc(img, center, pt1, pt2, angle, target_angle, is_bad=False, radius=46):
    v1 = np.array(pt1, dtype=np.float32) - np.array(center, dtype=np.float32)
    v2 = np.array(pt2, dtype=np.float32) - np.array(center, dtype=np.float32)
    n1 = np.linalg.norm(v1)
    n2 = np.linalg.norm(v2)
    if n1 == 0 or n2 == 0:
        return
    ang1 = float(np.degrees(np.arctan2(v1[1], v1[0]))) % 360
    ang2 = float(np.degrees(np.arctan2(v2[1], v2[0]))) % 360

    start_ang = min(ang1, ang2)
    end_ang = max(ang1, ang2)
    if end_ang - start_ang > 180:
        start_ang, end_ang = end_ang, start_ang + 360

    is_hit = angle >= target_angle
    color = (60, 60, 255) if is_bad else ((0, 255, 128) if is_hit else (0, 240, 200))
    glow_col = (color[0] // 3, color[1] // 3, color[2] // 3)
    c = _pt_i(center)

    cv2.ellipse(img, c, (radius, radius), 0, start_ang, end_ang, glow_col, 5, cv2.LINE_AA)
    cv2.ellipse(img, c, (radius, radius), 0, start_ang, end_ang, color, 2, cv2.LINE_AA)

    if is_hit and not is_bad:
        cv2.circle(img, c, radius + 8, (0, 255, 128), 1, cv2.LINE_AA)
        cv2.circle(img, c, radius + 11, (0, 120, 60), 1, cv2.LINE_AA)


def draw_ghost_skeleton(img, landmarks_pts):
    CONNECTIONS = [
        (11, 12), (11, 23), (12, 24), (23, 24),
        (12, 14), (14, 16),
        (11, 13), (13, 15),
        (24, 26), (26, 28),
        (23, 25), (25, 27)
    ]
    ghost_color = (60, 68, 78)
    for i, j in CONNECTIONS:
        if i in landmarks_pts and j in landmarks_pts:
            cv2.line(img, _pt_i(landmarks_pts[i]), _pt_i(landmarks_pts[j]), ghost_color, 1, cv2.LINE_AA)


# =========================================================================
# 3. MAIN PHYSIOPULSE ENGINE (8 PROTOCOLS + HIGH-SPEED PRECISION CORE)
# =========================================================================
def main():
    global live_telemetry, latest_jpeg_frame, latest_frame_id, external_action, is_streaming, show_skeleton
    parser = argparse.ArgumentParser(description="PhysioPulse AI Vision Engine")
    parser.add_argument("--embedded", action="store_true", default=False, help="Run in embedded web streaming mode")
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

    coach = VoiceCoach(cooldown=3.5)
    pt_filter = PointOneEuroFilter(min_cutoff=1.15, beta=0.015)
    world_filter = World3DOneEuroFilter(min_cutoff=0.9, beta=0.01)
    angle_filter = ValueOneEuroFilter(min_cutoff=0.95, beta=0.012)
    sym_filter = ValueOneEuroFilter(min_cutoff=0.8, beta=0.008)

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

    protocol_guide = {
        1: {
            "title": "Frozen Shoulder Lateral Abduction",
            "short_name": "Shoulder Abduction",
            "joint": "Glenohumeral Joint (Shoulder)",
            "setup": "Stand or sit upright facing the camera, arm resting at your side.",
            "action": "Slowly raise your arm out to the side until parallel to floor (90°).",
            "avoid": "Keep shoulders relaxed down. Do not shrug shoulder or tilt torso sideways.",
            "camera_view": "Front View (Works Seated or Standing)"
        },
        2: {
            "title": "Post-ACL Knee Extension & Controlled Squat",
            "short_name": "Knee Squat & Extension",
            "joint": "Tibiofemoral & Patellofemoral (Knee)",
            "setup": "Stand with feet shoulder-width apart, full body in camera frame.",
            "action": "Hinge hips back and bend knees down to 90° into a controlled squat.",
            "avoid": "Keep knees tracking over toes. Do not lean chest excessively forward.",
            "camera_view": "Full Body Front/Oblique View"
        },
        3: {
            "title": "Cervical & Ergonomic Posture Retraction Guard",
            "short_name": "Cervical Posture Guard",
            "joint": "Craniovertebral & Neck Spine",
            "setup": "Sit tall facing camera, relax shoulders down away from ears.",
            "action": "Gently glide chin straight backwards and hold ergonomic alignment for 5 sec.",
            "avoid": "Do not tilt head down or sideways. Keep eye gaze horizontal.",
            "camera_view": "Upper Body Seated View"
        },
        4: {
            "title": "Post-Fracture Elbow Flexion Rehabilitation",
            "short_name": "Elbow Flexion Curl",
            "joint": "Humeroulnar Joint (Elbow)",
            "setup": "Sit or stand with upper arm pinned lightly against side of ribcage.",
            "action": "Bend elbow smoothly, curling palm upward toward shoulder (125°+).",
            "avoid": "Keep upper arm pinned. Do not swing elbow forward or flare outward.",
            "camera_view": "Front / Seated View"
        },
        5: {
            "title": "Bilateral Overhead Wall-Slide Sync",
            "short_name": "Overhead Wall Slide",
            "joint": "Scapulothoracic & Serratus Anterior",
            "setup": "Sit or stand tall with both elbows visible in camera frame.",
            "action": "Slide both arms upwards simultaneously into high 'V' pattern (120°+).",
            "avoid": "Keep arms symmetrical. Do not lift one arm faster than the other.",
            "camera_view": "Front View (Both Arms)"
        },
        6: {
            "title": "Total Hip Replacement Lateral Side Abduction",
            "short_name": "Hip Side Abduction",
            "joint": "Coxofemoral & Gluteus Medius (Hip)",
            "setup": "Stand upright with support if needed, feet pointing straight forward.",
            "action": "Keeping leg straight, smoothly raise leg out to side to 28°-35°.",
            "avoid": "Keep torso strictly vertical. Do not lean upper body sideways.",
            "camera_view": "Full Body Front View"
        },
        7: {
            "title": "Lumbar Spine Flexion & Hip Hinge Rehab",
            "short_name": "Lumbar Hip Hinge",
            "joint": "Lumbopelvic Rhythm & Spine",
            "setup": "Stand with shoulders and hips visible in camera frame.",
            "action": "Hinge forward from hips, keeping spine long and flat (25°-35°).",
            "avoid": "Keep shoulders level. Do not twist spine while hinging.",
            "camera_view": "Upper/Full Body View"
        },
        8: {
            "title": "Carpal Tunnel Wrist & Forearm Extension",
            "short_name": "Wrist & Nerve Glide",
            "joint": "Radiocarpal Joint (Wrist)",
            "setup": "Sit with forearm raised clearly in camera view.",
            "action": "Slowly flex and extend wrist upward toward ceiling (22°+).",
            "avoid": "Keep shoulders relaxed. Do not shrug shoulder to lift hand.",
            "camera_view": "Seated Forearm/Wrist View"
        }
    }

    # ---------------------------------------------------------------------
    # 3.1 PRESCRIPTION QUEUE INITIALIZATION
    # ---------------------------------------------------------------------
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
            with open(prescribed_file_path, "r", encoding="utf-8") as f:
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
        mode = 3
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

    calibration_frames = 0
    baseline_calibrated = False
    calib_samples_tilt = []
    calib_samples_neck = []
    baseline_shoulder_tilt = 0.0
    baseline_neck_deviation = 0.0
    reached_peak = False
    peak_hold_frames = 0
    max_rep_rom = 0

    kinematic_phase = "REST"
    last_rep_time = 0.0
    angular_velocity = 0.0
    prev_angle = 0.0
    prev_angle_time = time.monotonic()

    completed_exercises = []
    current_exercise_start_time = time.monotonic()
    symmetry_samples = []
    compensation_reasons = {}
    p3_hold_timer = 0.0
    last_frame_wall_time = time.monotonic()
    advancing = False
    advance_start_time = 0.0
    advance_delay = 3.0

    def reset_exercise_state(new_mode):
        nonlocal reps, max_rom, bad_frame_streak, posture_errors, symmetry_samples, compensation_reasons
        nonlocal p3_hold_timer, stage, last_rep_time, prev_angle, angular_velocity
        nonlocal calibration_frames, baseline_calibrated, calib_samples_tilt, calib_samples_neck
        nonlocal baseline_shoulder_tilt, baseline_neck_deviation, reached_peak, peak_hold_frames, max_rep_rom
        nonlocal current_exercise_start_time, advancing

        reps = 0
        max_rom = 0
        bad_frame_streak = 0
        posture_errors = 0
        symmetry_samples = []
        compensation_reasons = {}
        p3_hold_timer = 0.0
        stage = "DOWN" if new_mode not in [2, 7] else "UP"
        angle_filter.f = None
        sym_filter.f = None
        pt_filter.reset()
        world_filter.reset()
        last_rep_time = 0.0
        prev_angle = 0.0
        angular_velocity = 0.0
        calibration_frames = 0
        baseline_calibrated = False
        calib_samples_tilt = []
        calib_samples_neck = []
        baseline_shoulder_tilt = 0.0
        baseline_neck_deviation = 0.0
        reached_peak = False
        peak_hold_frames = 0
        max_rep_rom = 0
        current_exercise_start_time = time.monotonic()
        advancing = False

    camera = ZeroLatencyCamera(width=848, height=480)

    window_name = "PhysioPulse AI - Clinical Vision Engine"
    if not embedded:
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)

    start_time = time.monotonic()
    last_timestamp_ms = -1
    fps_history = []
    prev_loop_time = time.monotonic()

    # Landmarks needed for ghost skeleton + active protocols (avoids filtering unused facial/foot points)
    ACTIVE_LANDMARK_INDICES = [0, 7, 8, 11, 12, 13, 14, 15, 16, 19, 20, 23, 24, 25, 26, 27, 28]

    with vision.PoseLandmarker.create_from_options(options) as landmarker:
        while camera.is_opened() and is_streaming:
            ret, frame, frame_capture_time = camera.read_latest()
            if not ret or frame is None:
                time.sleep(0.004)
                continue

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

            # PERFORMANCE UPGRADE: Downscale ONLY the inference buffer to 512x288 & enforce contiguous memory
            inf_frame = cv2.resize(frame, (512, 288), interpolation=cv2.INTER_LINEAR)
            rgb_frame = np.ascontiguousarray(cv2.cvtColor(inf_frame, cv2.COLOR_BGR2RGB))
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            timestamp_ms = int((time.monotonic() - start_time) * 1000)
            if timestamp_ms <= last_timestamp_ms:
                timestamp_ms = last_timestamp_ms + 1
            last_timestamp_ms = timestamp_ms

            results = landmarker.detect_for_video(mp_image, timestamp_ms)

            primary_angle = 0
            symmetry_score = 100
            is_bad_form = False
            active_correction_cue = None
            active_correction_direction = None

            if results.pose_landmarks and len(results.pose_landmarks) > 0:
                lm = results.pose_landmarks[0]
                world_lm = results.pose_world_landmarks[0] if (results.pose_world_landmarks and len(results.pose_world_landmarks) > 0) else None

                # Filter only anatomically relevant landmarks for speed
                all_pts = {}
                for idx in ACTIVE_LANDMARK_INDICES:
                    raw = [lm[idx].x * w, lm[idx].y * h]
                    all_pts[idx] = pt_filter.smooth(idx, raw, now_wall)

                if show_skeleton:
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
                l_ear      = all_pts[8]
                r_ear      = all_pts[7]
                l_shoulder = all_pts[12]
                r_shoulder = all_pts[11]
                l_elbow    = all_pts[14]
                r_elbow    = all_pts[13]
                l_wrist    = all_pts[16]
                r_wrist    = all_pts[15]
                l_index    = all_pts[20]
                r_index    = all_pts[19]
                l_hip      = all_pts[24]
                r_hip      = all_pts[23]
                l_knee     = all_pts[26]
                r_knee     = all_pts[25]
                l_ankle    = all_pts[28]
                r_ankle    = all_pts[27]

                shoulder_width = max(40.0, np.linalg.norm(np.array(l_shoulder) - np.array(r_shoulder)))
                shoulder_tilt_ratio = abs(l_shoulder[1] - r_shoulder[1]) / shoulder_width

                # ACCURACY UPGRADE: Seated exercises (P1, P3, P4, P5, P8) do NOT require visible hips!
                req_landmarks = {
                    1: [11, 12, 13, 14],
                    2: [23, 24, 25, 26, 27, 28],
                    3: [0, 7, 8, 11, 12],
                    4: [11, 12, 13, 14, 15, 16],
                    5: [11, 12, 13, 14],
                    6: [23, 24, 25, 26, 27, 28],
                    7: [11, 12, 23, 24],
                    8: [13, 14, 15, 16, 19, 20]
                }
                needed_indices = req_landmarks.get(mode, [11, 12])
                tracking_visible = is_visible(needed_indices, threshold=0.38)
                hips_clearly_visible = is_visible([23, 24], threshold=0.65)

                # Adaptive Neutral Calibration (22 frames ~ 0.6s for snappy startup)
                if not baseline_calibrated and tracking_visible:
                    calibration_frames += 1
                    calib_samples_tilt.append(shoulder_tilt_ratio)
                    mid_sh_c = [(l_shoulder[0] + r_shoulder[0]) / 2, (l_shoulder[1] + r_shoulder[1]) / 2]
                    vert_up_c = [mid_sh_c[0], mid_sh_c[1] - 200]
                    curr_neck_dev = calculate_angle_2d(vert_up_c, mid_sh_c, nose)
                    calib_samples_neck.append(curr_neck_dev)

                    form_status = "CALIBRATING ZERO-POINT..."
                    feedback_text = f"Hold neutral posture ({min(100, int(calibration_frames / 22 * 100))}%)..."

                    if calibration_frames >= 22:
                        baseline_shoulder_tilt = float(np.median(calib_samples_tilt)) if calib_samples_tilt else 0.0
                        baseline_neck_deviation = float(np.median(calib_samples_neck)) if calib_samples_neck else 0.0
                        baseline_calibrated = True
                        form_status = "OPTIMAL BIOMECHANICS"
                        feedback_text = "Baseline calibrated! Begin exercise."
                        coach.speak("Calibrated. Begin exercise.", force=True)

                relative_tilt = max(0.0, shoulder_tilt_ratio - baseline_shoulder_tilt) if baseline_calibrated else 0.0
                raw_sym = max(0, min(100, int(100 - (relative_tilt / 0.22) * 50)))
                symmetry_score = sym_filter.update(raw_sym, now_wall)
                symmetry_samples.append(symmetry_score)
                if len(symmetry_samples) > 600:
                    symmetry_samples.pop(0)

                active_color = (0, 240, 200)

                if not tracking_visible:
                    form_status = "ADJUST POSITION"
                    feedback_text = "Ensure target joints are clearly visible in camera frame."

                # =========================================================
                # PROTOCOL 1: FROZEN SHOULDER ABDUCTION (Seated & Standing Hybrid)
                # =========================================================
                if mode == 1:
                    ref_l = l_hip if hips_clearly_visible else [l_shoulder[0], l_shoulder[1] + 200]
                    ref_r = r_hip if hips_clearly_visible else [r_shoulder[0], r_shoulder[1] + 200]

                    if hips_clearly_visible:
                        ang_l = get_fused_angle(world_lm, world_filter, now_wall, ref_l, l_shoulder, l_elbow, 24, 12, 14)
                        ang_r = get_fused_angle(world_lm, world_filter, now_wall, ref_r, r_shoulder, r_elbow, 23, 11, 13)
                    else:
                        ang_l = calculate_angle_2d(ref_l, l_shoulder, l_elbow)
                        ang_r = calculate_angle_2d(ref_r, r_shoulder, r_elbow)

                    if ang_r > ang_l + 8:
                        act_sh, act_el, act_wr = r_shoulder, r_elbow, r_wrist
                        act_sh_idx, act_el_idx, act_wr_idx = 11, 13, 15
                        raw_angle = ang_r
                        act_ref = ref_r
                        opp_sh = l_shoulder
                    else:
                        act_sh, act_el, act_wr = l_shoulder, l_elbow, l_wrist
                        act_sh_idx, act_el_idx, act_wr_idx = 12, 14, 16
                        raw_angle = ang_l
                        act_ref = ref_l
                        opp_sh = r_shoulder

                    primary_angle = angle_filter.update(raw_angle, now_wall)
                    elbow_straightness = get_fused_angle(world_lm, world_filter, now_wall, act_sh, act_el, act_wr, act_sh_idx, act_el_idx, act_wr_idx)

                    dt_vel = max(0.001, now_wall - prev_angle_time)
                    angular_velocity = round(abs(primary_angle - prev_angle) / dt_vel, 1)

                    if primary_angle > max_rom:
                        max_rom = primary_angle
                    if primary_angle > max_rep_rom:
                        max_rep_rom = primary_angle

                    frame_error = False
                    if baseline_calibrated and relative_tilt > 0.17 and primary_angle > 42:
                        frame_error = True
                        err_type = "COMPENSATION: SHRUGGING"
                        err_msg = "Keep shoulders level! Do not shrug."
                    elif elbow_straightness < 128 and primary_angle > 40:
                        frame_error = True
                        err_type = "COMPENSATION: BENT ELBOW"
                        err_msg = "Keep your arm straight as you raise it."

                    if frame_error:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = err_type
                            feedback_text = err_msg
                            coach.speak(err_msg)
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "OPTIMAL BIOMECHANICS"
                            feedback_text = f"Raise arm smoothly (Target: {target_rom} deg)."

                    abduction_target = max(65, target_rom - 10)
                    return_threshold = 32

                    if stage == "DOWN":
                        if primary_angle > return_threshold:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= abduction_target and not is_bad_form and angular_velocity < 175:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 3:
                                reached_peak = True
                                stage = "UP"
                                kinematic_phase = "PEAK"
                    elif stage == "UP":
                        if primary_angle < abduction_target - 10:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= return_threshold:
                            stage = "DOWN"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.1:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Peak {max_rep_rom} degrees.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, act_sh, act_ref, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
                        draw_clinical_bone(frame, act_sh, act_el, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, act_el, act_wr, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, l_shoulder, r_shoulder, color=(180, 200, 220), thickness=2, glow_ratio=0.2)

                        draw_clinical_joint(frame, act_sh, color=draw_color, radius=8)
                        draw_clinical_joint(frame, act_el, color=draw_color, radius=7)
                        draw_clinical_joint(frame, act_wr, color=draw_color, radius=6)
                        draw_clinical_joint(frame, opp_sh, color=(180, 200, 220), radius=6)

                        draw_goniometer_arc(frame, act_sh, act_ref, act_el, primary_angle, target_rom, is_bad=is_bad_form)

                    if is_bad_form:
                        if "SHRUGGING" in form_status:
                            active_correction_cue = "LOWER ELEVATED SHOULDER"
                            active_correction_direction = "DOWN"
                        elif "BENT ELBOW" in form_status:
                            active_correction_cue = "EXTEND ELBOW OUTWARD"
                            active_correction_direction = "OUT"

                # =========================================================
                # PROTOCOL 2: POST-ACL KNEE FLEXION / SQUAT (2D/3D Fused)
                # =========================================================
                elif mode == 2:
                    raw_l = get_fused_angle(world_lm, world_filter, now_wall, l_hip, l_knee, l_ankle, 24, 26, 28)
                    raw_r = get_fused_angle(world_lm, world_filter, now_wall, r_hip, r_knee, r_ankle, 23, 25, 27)

                    if raw_r < raw_l - 4:
                        act_h, act_k, act_a = r_hip, r_knee, r_ankle
                        raw_joint_angle = raw_r
                    else:
                        act_h, act_k, act_a = l_hip, l_knee, l_ankle
                        raw_joint_angle = raw_l

                    raw_flexion = max(0.0, 180.0 - raw_joint_angle)
                    primary_angle = angle_filter.update(raw_flexion, now_wall)
                    torso_lean = calculate_angle_2d(l_shoulder, act_h, act_k)

                    if primary_angle > max_rom:
                        max_rom = primary_angle
                    if primary_angle > max_rep_rom:
                        max_rep_rom = primary_angle

                    if torso_lean < 62 and primary_angle > 35:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "COMPENSATION: FORWARD LEAN"
                            feedback_text = "Keep your chest upright and spine neutral!"
                            coach.speak("Keep your chest up.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "OPTIMAL BIOMECHANICS"
                            feedback_text = f"Lower hips until knee reaches {target_rom} degrees."

                    flexion_target = max(60, target_rom - 10)
                    standing_threshold = 26

                    if stage == "UP":
                        if primary_angle > standing_threshold:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= flexion_target and not is_bad_form:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 3:
                                reached_peak = True
                                stage = "DOWN"
                                kinematic_phase = "PEAK"
                    elif stage == "DOWN":
                        if primary_angle < flexion_target - 10:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= standing_threshold:
                            stage = "UP"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.2:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Squat completed.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, l_shoulder, act_h, color=draw_color, thickness=3)
                        draw_clinical_bone(frame, act_h, act_k, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, act_k, act_a, color=draw_color, thickness=4)

                        draw_clinical_joint(frame, act_h, color=draw_color, radius=7)
                        draw_clinical_joint(frame, act_k, color=draw_color, radius=9)
                        draw_clinical_joint(frame, act_a, color=draw_color, radius=7)

                        draw_goniometer_arc(frame, act_k, act_h, act_a, primary_angle, target_rom, is_bad=is_bad_form)

                    if is_bad_form:
                        active_correction_cue = "KEEP CHEST UPRIGHT"
                        active_correction_direction = "UP"

                # =========================================================
                # PROTOCOL 3: CERVICAL & DESK POSTURE GUARD
                # =========================================================
                elif mode == 3:
                    mid_shoulder = [(l_shoulder[0] + r_shoulder[0]) / 2, (l_shoulder[1] + r_shoulder[1]) / 2]
                    vertical_up = [mid_shoulder[0], mid_shoulder[1] - 200]
                    neck_deviation = calculate_angle_2d(vertical_up, mid_shoulder, nose)

                    rel_neck_drift = abs(neck_deviation - baseline_neck_deviation) if baseline_calibrated else 0.0
                    raw_cervical_score = max(0, min(100, int(100 - rel_neck_drift * 3.5)))
                    primary_angle = angle_filter.update(raw_cervical_score, now_wall)

                    ear_tilt_ratio = abs(l_ear[1] - r_ear[1]) / shoulder_width
                    max_rom = max(max_rom, primary_angle)

                    if baseline_calibrated and (symmetry_score < 72 or rel_neck_drift > 13 or ear_tilt_ratio > 0.15):
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "POSTURE DRIFT DETECTED"
                            feedback_text = f"Neck drift: {int(rel_neck_drift)} deg | Retract chin & align shoulders!"
                            coach.speak("Align your neck and shoulders.")
                            kinematic_phase = "POSTURE DRIFT"
                            p3_hold_timer = max(0.0, p3_hold_timer - dt * 0.8)
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "ERGONOMIC ALIGNMENT"
                            p3_hold_timer += dt
                            feedback_text = f"Alignment: {primary_angle}% | Hold: {round(p3_hold_timer, 1)}s/5.0s"
                            kinematic_phase = "ISOMETRIC HOLD"
                            if p3_hold_timer >= 5.0:
                                reps += 1
                                p3_hold_timer = 0.0
                                coach.speak(f"Posture hold {reps} complete. Keep aligned.", force=True)

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, mid_shoulder, vertical_up, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
                        draw_clinical_bone(frame, l_shoulder, r_shoulder, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, mid_shoulder, nose, color=draw_color, thickness=3)
                        draw_clinical_bone(frame, l_ear, r_ear, color=(180, 200, 220), thickness=2, glow_ratio=0.2)

                        for pt in [l_shoulder, r_shoulder, mid_shoulder, nose, l_ear, r_ear]:
                            draw_clinical_joint(frame, pt, color=draw_color, radius=6)

                    if is_bad_form:
                        active_correction_cue = "RETRACT CHIN / ALIGN SPINE"
                        active_correction_direction = "UP"

                # =========================================================
                # PROTOCOL 4: POST-FRACTURE ELBOW FLEXION (Seated & Standing Hybrid)
                # =========================================================
                elif mode == 4:
                    ang_l = get_fused_angle(world_lm, world_filter, now_wall, l_shoulder, l_elbow, l_wrist, 12, 14, 16)
                    ang_r = get_fused_angle(world_lm, world_filter, now_wall, r_shoulder, r_elbow, r_wrist, 11, 13, 15)

                    ref_l = l_hip if hips_clearly_visible else [l_shoulder[0], l_shoulder[1] + 200]
                    ref_r = r_hip if hips_clearly_visible else [r_shoulder[0], r_shoulder[1] + 200]

                    if ang_r < ang_l - 6:
                        act_sh, act_el, act_wr = r_shoulder, r_elbow, r_wrist
                        raw_joint = ang_r
                        act_ref = ref_r
                    else:
                        act_sh, act_el, act_wr = l_shoulder, l_elbow, l_wrist
                        raw_joint = ang_l
                        act_ref = ref_l

                    raw_flexion = max(0.0, 180.0 - raw_joint)
                    primary_angle = angle_filter.update(raw_flexion, now_wall)
                    upper_arm_drift = calculate_angle_2d(act_ref, act_sh, act_el)

                    if primary_angle > max_rom:
                        max_rom = primary_angle
                    if primary_angle > max_rep_rom:
                        max_rep_rom = primary_angle

                    if upper_arm_drift > 28 and primary_angle > 38:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "COMPENSATION: ELBOW DRIFT"
                            feedback_text = "Pin your elbow close to your ribs! Don't swing."
                            coach.speak("Keep your elbow pinned to your side.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "OPTIMAL BIOMECHANICS"
                            feedback_text = f"Curl hand upward toward shoulder (Target: {target_rom} deg)."

                    flexion_target = max(80, target_rom - 15)
                    extension_threshold = 38

                    if stage == "DOWN":
                        if primary_angle > extension_threshold:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= flexion_target and not is_bad_form:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 3:
                                reached_peak = True
                                stage = "UP"
                                kinematic_phase = "PEAK"
                    elif stage == "UP":
                        if primary_angle < flexion_target - 10:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= extension_threshold:
                            stage = "DOWN"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.1:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Full curl complete.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, act_sh, act_ref, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
                        draw_clinical_bone(frame, act_sh, act_el, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, act_el, act_wr, color=draw_color, thickness=4)

                        draw_clinical_joint(frame, act_sh, color=draw_color, radius=7)
                        draw_clinical_joint(frame, act_el, color=draw_color, radius=8)
                        draw_clinical_joint(frame, act_wr, color=draw_color, radius=6)

                        draw_goniometer_arc(frame, act_el, act_sh, act_wr, primary_angle, target_rom, is_bad=is_bad_form)

                    if is_bad_form:
                        active_correction_cue = "PIN ELBOW TO TORSO"
                        active_correction_direction = "DOWN"

                # =========================================================
                # PROTOCOL 5: BILATERAL OVERHEAD WALL-SLIDE (Seated & Standing Hybrid)
                # =========================================================
                elif mode == 5:
                    ref_l = l_hip if hips_clearly_visible else [l_shoulder[0], l_shoulder[1] + 200]
                    ref_r = r_hip if hips_clearly_visible else [r_shoulder[0], r_shoulder[1] + 200]

                    if hips_clearly_visible:
                        l_ang = get_fused_angle(world_lm, world_filter, now_wall, ref_l, l_shoulder, l_elbow, 24, 12, 14)
                        r_ang = get_fused_angle(world_lm, world_filter, now_wall, ref_r, r_shoulder, r_elbow, 23, 11, 13)
                    else:
                        l_ang = calculate_angle_2d(ref_l, l_shoulder, l_elbow)
                        r_ang = calculate_angle_2d(ref_r, r_shoulder, r_elbow)

                    primary_angle = angle_filter.update((l_ang + r_ang) / 2.0, now_wall)
                    arm_diff = abs(l_ang - r_ang)
                    symmetry_score = sym_filter.update(max(0, min(100, int(100 - arm_diff * 1.8))), now_wall)

                    if primary_angle > max_rom:
                        max_rom = primary_angle
                    if primary_angle > max_rep_rom:
                        max_rep_rom = primary_angle

                    if arm_diff > 20 and primary_angle > 48:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = f"ASYMMETRY: {int(arm_diff)} DEG GAP"
                            feedback_text = "Raise both arms at the exact same height!"
                            coach.speak("Arm asymmetry detected. Level both arms.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "BILATERAL SYNC OPTIMAL"
                            feedback_text = f"L: {int(l_ang)} deg | R: {int(r_ang)} deg (Raise both overhead)"

                    slide_target = max(95, target_rom - 15)
                    slide_return = 45

                    if stage == "DOWN":
                        if primary_angle > slide_return:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= slide_target and not is_bad_form:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 3:
                                reached_peak = True
                                stage = "UP"
                                kinematic_phase = "PEAK"
                    elif stage == "UP":
                        if primary_angle < slide_target - 10:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= slide_return:
                            stage = "DOWN"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.2:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Bilateral slide complete.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, l_shoulder, l_elbow, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, l_elbow, l_wrist, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, r_shoulder, r_elbow, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, r_elbow, r_wrist, color=draw_color, thickness=4)

                        for pt in [l_shoulder, l_elbow, l_wrist, r_shoulder, r_elbow, r_wrist]:
                            draw_clinical_joint(frame, pt, color=draw_color, radius=7)

                    if is_bad_form:
                        active_correction_cue = "BALANCE BOTH ARMS & AVOID SHRUGGING"
                        active_correction_direction = "DOWN"

                # =========================================================
                # PROTOCOL 6: TOTAL HIP REPLACEMENT ABDUCTION
                # =========================================================
                elif mode == 6:
                    mid_h = [(l_hip[0] + r_hip[0]) / 2, (l_hip[1] + r_hip[1]) / 2]
                    spine_down = [mid_h[0], mid_h[1] + 200]
                    ang_l = calculate_angle_2d(spine_down, l_hip, l_ankle)
                    ang_r = calculate_angle_2d(spine_down, r_hip, r_ankle)

                    if ang_r > ang_l + 5:
                        act_h, act_k, act_a = r_hip, r_knee, r_ankle
                        raw_angle = ang_r
                        act_sh = r_shoulder
                    else:
                        act_h, act_k, act_a = l_hip, l_knee, l_ankle
                        raw_angle = ang_l
                        act_sh = l_shoulder

                    primary_angle = angle_filter.update(raw_angle, now_wall)
                    torso_vert = [act_h[0], act_h[1] - 200]
                    trunk_lean = calculate_angle_2d(torso_vert, act_h, act_sh)

                    if primary_angle > max_rom:
                        max_rom = primary_angle
                    if primary_angle > max_rep_rom:
                        max_rep_rom = primary_angle

                    if trunk_lean > 18 and primary_angle > 14:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "COMPENSATION: TRUNK LEAN"
                            feedback_text = "Keep upper body vertical! Don't lean sideways."
                            coach.speak("Do not lean your torso sideways.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "OPTIMAL PELVIC STABILITY"
                            feedback_text = f"Lift leg out to the side smoothly (Target: {target_rom} deg)."

                    abduct_target = max(18, target_rom - 6)
                    abduct_return = 10

                    if stage == "DOWN":
                        if primary_angle > abduct_return:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= abduct_target and not is_bad_form:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 3:
                                reached_peak = True
                                stage = "UP"
                                kinematic_phase = "PEAK"
                    elif stage == "UP":
                        if primary_angle < abduct_target - 5:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= abduct_return:
                            stage = "DOWN"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.2:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Hip abduction complete.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, act_sh, act_h, color=draw_color, thickness=3)
                        draw_clinical_bone(frame, act_h, act_k, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, act_k, act_a, color=draw_color, thickness=4)

                        for pt in [act_sh, act_h, act_k, act_a]:
                            draw_clinical_joint(frame, pt, color=draw_color, radius=7)

                        draw_goniometer_arc(frame, act_h, spine_down, act_a, primary_angle, target_rom, is_bad=is_bad_form)

                    if is_bad_form:
                        active_correction_cue = "KEEP PELVIS LEVEL & TORSO VERTICAL"
                        active_correction_direction = "UP"

                # =========================================================
                # PROTOCOL 7: LUMBAR SPINE FLEXION / HINGE
                # =========================================================
                elif mode == 7:
                    torso_vert = [l_hip[0], l_hip[1] - 200]
                    raw_hinge = calculate_angle_2d(torso_vert, l_hip, l_shoulder)
                    primary_angle = angle_filter.update(raw_hinge, now_wall)

                    if primary_angle > max_rom:
                        max_rom = primary_angle
                    if primary_angle > max_rep_rom:
                        max_rep_rom = primary_angle

                    if baseline_calibrated and relative_tilt > 0.18 and primary_angle > 18:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "COMPENSATION: SPINAL TWIST"
                            feedback_text = "Keep shoulders square! Do not twist your lower back."
                            coach.speak("Keep your spine symmetrical. Do not twist.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "OPTIMAL LUMBAR MECHANICS"
                            feedback_text = f"Hinge forward gently (Target: {target_rom} deg), then return upright."

                    hinge_target = max(22, min(target_rom - 5, 50))
                    upright_threshold = 10

                    if stage == "UP":
                        if primary_angle > upright_threshold:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= hinge_target and not is_bad_form:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 3:
                                reached_peak = True
                                stage = "DOWN"
                                kinematic_phase = "PEAK"
                    elif stage == "DOWN":
                        if primary_angle < hinge_target - 6:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= upright_threshold:
                            stage = "UP"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.2:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Smooth lumbar hinge.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, l_hip, torso_vert, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
                        draw_clinical_bone(frame, l_hip, l_shoulder, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, l_shoulder, r_shoulder, color=draw_color, thickness=3)

                        for pt in [l_hip, l_shoulder, r_shoulder]:
                            draw_clinical_joint(frame, pt, color=draw_color, radius=7)

                        draw_goniometer_arc(frame, l_hip, torso_vert, l_shoulder, primary_angle, target_rom, is_bad=is_bad_form)

                    if is_bad_form:
                        active_correction_cue = "MAINTAIN FLAT BACK / SPINE ALIGNMENT"
                        active_correction_direction = "UP"

                # =========================================================
                # PROTOCOL 8: CARPAL TUNNEL WRIST & FOREARM EXTENSION
                # =========================================================
                elif mode == 8:
                    raw_l = calculate_angle_2d(l_elbow, l_wrist, l_index)
                    raw_r = calculate_angle_2d(r_elbow, r_wrist, r_index)
                    dev_l = abs(180.0 - raw_l)
                    dev_r = abs(180.0 - raw_r)

                    if dev_r > dev_l + 4:
                        act_el, act_wr, act_idx = r_elbow, r_wrist, r_index
                        raw_dev = dev_r
                    else:
                        act_el, act_wr, act_idx = l_elbow, l_wrist, l_index
                        raw_dev = dev_l

                    wrist_deviation = angle_filter.update(raw_dev, now_wall)
                    primary_angle = wrist_deviation

                    if wrist_deviation > max_rom:
                        max_rom = wrist_deviation
                    if wrist_deviation > max_rep_rom:
                        max_rep_rom = wrist_deviation

                    if baseline_calibrated and relative_tilt > 0.17:
                        bad_frame_streak += 1
                        if bad_frame_streak >= 8:
                            is_bad_form = True
                            form_status = "COMPENSATION: SHOULDER TENSION"
                            feedback_text = "Relax your shoulder down while flexing wrist!"
                            coach.speak("Relax your shoulder while moving your wrist.")
                    else:
                        bad_frame_streak = max(0, bad_frame_streak - 1)
                        if baseline_calibrated:
                            form_status = "OPTIMAL TENDON GLIDE"
                            feedback_text = f"Wrist Flex/Ext: {wrist_deviation} deg (Target: {target_rom} deg)"

                    wrist_target = max(16, target_rom - 5)
                    wrist_return = 8

                    if stage == "DOWN":
                        if primary_angle > wrist_return:
                            kinematic_phase = "CONCENTRIC"
                        if primary_angle >= wrist_target and not is_bad_form:
                            peak_hold_frames += 1
                            if peak_hold_frames >= 2:
                                reached_peak = True
                                stage = "UP"
                                kinematic_phase = "PEAK"
                    elif stage == "UP":
                        if primary_angle < wrist_target - 4:
                            kinematic_phase = "ECCENTRIC"
                        if primary_angle <= wrist_return:
                            stage = "DOWN"
                            kinematic_phase = "REST"
                            peak_hold_frames = 0
                            if reached_peak and (now_wall - last_rep_time) > 1.0:
                                reps += 1
                                last_rep_time = now_wall
                                reached_peak = False
                                coach.speak(f"Rep {reps}. Good tendon glide.", force=True)
                                max_rep_rom = 0

                    if show_skeleton:
                        draw_color = (60, 60, 255) if is_bad_form else active_color
                        draw_clinical_bone(frame, act_el, act_wr, color=draw_color, thickness=4)
                        draw_clinical_bone(frame, act_wr, act_idx, color=draw_color, thickness=3)

                        for pt in [act_el, act_wr, act_idx]:
                            draw_clinical_joint(frame, pt, color=draw_color, radius=6)

                        draw_goniometer_arc(frame, act_wr, act_el, act_idx, primary_angle, target_rom, is_bad=is_bad_form)

                    if is_bad_form:
                        active_correction_cue = "RELAX SHOULDER & STABILIZE FOREARM"
                        active_correction_direction = "DOWN"

                dt_vel = max(0.001, now_wall - prev_angle_time)
                angular_velocity = round(abs(primary_angle - prev_angle) / dt_vel, 1)
                prev_angle = primary_angle
                prev_angle_time = now_wall

                if is_bad_form:
                    posture_errors += 1
                    comp_name = form_status
                    if "ASYMMETRY" in comp_name:
                        comp_name = "COMPENSATION: BILATERAL ASYMMETRY"
                    elif "POSTURE DRIFT" in comp_name:
                        comp_name = "COMPENSATION: POSTURE DRIFT"
                    compensation_reasons[comp_name] = compensation_reasons.get(comp_name, 0) + 1

            # =============================================================
            # 3.2 AUTO-ADVANCE TRIGGER (PRESCRIBED QUEUE)
            # =============================================================
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

            # =============================================================
            # 4. AUTO-ADVANCE TRANSITION LOGIC
            # =============================================================
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
                        active_protocol_name = current_ex.get("protocol_name", mode_names.get(mode, f"Protocol {mode}"))
                        reset_exercise_state(mode)
                        coach.speak(f"Next exercise: {active_protocol_name}. Target: {target_reps} reps.", force=True)
                    else:
                        coach.speak("All prescribed exercises completed! Generating clinical report.", force=True)
                        with stream_lock:
                            live_telemetry["completed"] = True
                            live_telemetry["feedback_text"] = "All exercises complete! Compiling clinical report..."
                        time.sleep(1.0)
                        break

            cur_guide = protocol_guide.get(mode, {
                "title": active_protocol_name,
                "short_name": active_protocol_name,
                "joint": "Target Articulation",
                "setup": "Position body in camera view.",
                "action": "Perform prescribed motion smoothly.",
                "avoid": "Maintain clean alignment.",
                "camera_view": "Front View"
            })

            stream_out = frame if frame.shape[1] <= 854 else cv2.resize(frame, (848, 480))
            ret_enc, buffer = cv2.imencode('.jpg', stream_out, [cv2.IMWRITE_JPEG_QUALITY, 72])
            if ret_enc:
                now_enc = time.monotonic()
                capture_latency_ms = round((now_enc - frame_capture_time) * 1000, 1)
                with stream_lock:
                    latest_jpeg_frame = buffer.tobytes()
                    latest_frame_id += 1
                    new_frame_condition.notify_all()
                    live_telemetry = {
                        "mode": mode,
                        "protocol_name": active_protocol_name,
                        "exercise_title": cur_guide["title"],
                        "exercise_short_name": cur_guide["short_name"],
                        "target_joint": cur_guide["joint"],
                        "setup_instruction": cur_guide["setup"],
                        "action_instruction": cur_guide["action"],
                        "form_tip": cur_guide["avoid"],
                        "camera_view": cur_guide["camera_view"],
                        "reps": reps,
                        "target_reps": target_reps,
                        "primary_angle": primary_angle,
                        "max_rom": max_rom,
                        "target_rom": target_rom,
                        "symmetry_score": symmetry_score,
                        "form_status": form_status,
                        "is_bad_form": is_bad_form,
                        "feedback_text": feedback_text,
                        "correction_cue": active_correction_cue,
                        "correction_direction": active_correction_direction,
                        "queue_idx": queue_idx,
                        "total_queue": len(prescription_queue) if is_prescribed_mode else 1,
                        "advancing": advancing,
                        "remaining_advance_sec": max(0, round(remaining_sec, 1)) if advancing else 0,
                        "p3_hold_timer": round(p3_hold_timer, 1),
                        "angular_velocity": angular_velocity,
                        "kinematic_phase": kinematic_phase,
                        "show_skeleton": show_skeleton,
                        "patient_name": patient_name,
                        "fps": rolling_fps,
                        "latency_ms": capture_latency_ms,
                        "completed": False
                    }

            if not embedded:
                disp_frame = frame.copy()
                h_f, w_f = disp_frame.shape[:2]
                cv2.rectangle(disp_frame, (0, 0), (w_f, 68), (14, 18, 24), -1)
                cv2.line(disp_frame, (0, 68), (w_f, 68), (0, 240, 200), 2)

                hud_title = f"EXERCISE {queue_idx + 1}/{(len(prescription_queue) if is_prescribed_mode else 1)}: {cur_guide['title']} ({cur_guide['joint']})"
                cv2.putText(disp_frame, hud_title, (16, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 200), 2, cv2.LINE_AA)

                hud_instr = f"ACTION: {cur_guide['action']}  |  FPS: {rolling_fps}"
                cv2.putText(disp_frame, hud_instr, (16, 52), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (220, 230, 240), 1, cv2.LINE_AA)

                hud_stats = f"Reps: {reps}/{target_reps} | ROM: {primary_angle}d/{target_rom}d"
                cv2.putText(disp_frame, hud_stats, (w_f - 260, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1, cv2.LINE_AA)

                cv2.imshow(window_name, disp_frame)
                key = cv2.waitKey(1) & 0xFF
            else:
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
                    reset_exercise_state(mode)
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
                reset_exercise_state(mode)
                coach.speak(f"Protocol {mode} activated.", force=True)

    is_streaming = False
    camera.release()
    if not embedded:
        cv2.destroyAllWindows()

    # ---------------------------------------------------------------------
    # 5. RICH MULTI-EXERCISE TELEMETRY JSON EXPORT
    # ---------------------------------------------------------------------
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
    with open(report_file_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=4)

    print("✅ Clinical session multi-exercise telemetry successfully written to clinical_session_report.json")
    sys.exit(0)


if __name__ == "__main__":
    main()