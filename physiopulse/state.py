import threading
import time
import numpy as np
import cv2

def _generate_init_frame():
    try:
        img = np.zeros((480, 848, 3), dtype=np.uint8)
        img[:] = (18, 18, 21)
        ret, buf = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 68])
        return buf.tobytes() if ret else None
    except Exception:
        return None

# Global thread synchronization primitives
stream_lock = threading.Lock()
new_frame_condition = threading.Condition(stream_lock)

# Shared stream state
latest_jpeg_frame = _generate_init_frame()
latest_frame_id = 0
active_stream_token = 0.0
active_stream_clients = 0  # Number of active MJPEG persistent viewers
last_snapshot_time = 0.0   # Timestamp of last snapshot request
is_streaming = True
external_action = None     # 'skip' or 'quit'
show_skeleton = True       # Toggleable via frontend
live_telemetry = {}

def update_jpeg_frame(jpeg_bytes: bytes):
    """Safely updates latest JPEG buffer and notifies waiting HTTP streaming threads."""
    global latest_jpeg_frame, latest_frame_id
    with stream_lock:
        latest_jpeg_frame = jpeg_bytes
        latest_frame_id += 1
        new_frame_condition.notify_all()

def get_latest_jpeg():
    global latest_jpeg_frame
    with stream_lock:
        return latest_jpeg_frame

def update_telemetry(telemetry_dict: dict):
    global live_telemetry
    with stream_lock:
        live_telemetry = telemetry_dict

def get_telemetry():
    global live_telemetry
    with stream_lock:
        return dict(live_telemetry)

def set_external_action(action: str):
    global external_action
    with stream_lock:
        external_action = action

def pop_external_action():
    global external_action
    with stream_lock:
        act = external_action
        external_action = None
        return act

def toggle_skeleton():
    global show_skeleton
    with stream_lock:
        show_skeleton = not show_skeleton
        return show_skeleton
