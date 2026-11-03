import os
import urllib.request

# Base paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

# Model configuration
LITE_MODEL_NAME = "pose_landmarker_lite.task"
FULL_MODEL_NAME = "pose_landmarker_full.task"

LITE_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
FULL_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task"

# Candidate search locations for model binaries (searches models/ folder, then root)
def get_model_candidates(filename: str):
    return [
        os.path.join(MODELS_DIR, filename),
        os.path.join(PROJECT_ROOT, filename),
    ]

def find_existing_model(filename: str):
    for candidate in get_model_candidates(filename):
        if os.path.exists(candidate):
            return candidate
    return None

def resolve_model_path(use_high_accuracy: bool = False) -> str:
    """
    Resolves the appropriate MediaPipe pose landmarker model.
    Prioritizes low-latency lite model (12-18ms) for 30+ FPS real-time webcam inference.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)
    target_name = FULL_MODEL_NAME if use_high_accuracy else LITE_MODEL_NAME
    target_url = FULL_MODEL_URL if use_high_accuracy else LITE_MODEL_URL

    existing = find_existing_model(target_name)
    if existing:
        return existing

    # Fallback to alternate model if already present locally
    alt_name = LITE_MODEL_NAME if use_high_accuracy else FULL_MODEL_NAME
    alt_existing = find_existing_model(alt_name)

    # Attempt download
    download_dest = os.path.join(MODELS_DIR, target_name)
    print(f"⏳ Downloading MediaPipe Pose model ({target_name})...")
    try:
        urllib.request.urlretrieve(target_url, download_dest)
        print(f"✅ Downloaded {target_name} to {download_dest}")
        return download_dest
    except Exception as e:
        print(f"⚠️ Warning: Could not download {target_name} ({e})")
        if alt_existing:
            print(f"ℹ️ Falling back to cached model: {alt_existing}")
            return alt_existing
        # Default destination path even if download failed
        return download_dest

# Camera & Streaming defaults
DEFAULT_FRAME_WIDTH = 848
DEFAULT_FRAME_HEIGHT = 480
INFERENCE_WIDTH = 512
INFERENCE_HEIGHT = 288
DEFAULT_PORT = 8000
DEFAULT_JPEG_QUALITY = 68

# Active Landmark Indices for Ghost Skeleton & Biomechanics
ACTIVE_LANDMARK_INDICES = [0, 7, 8, 11, 12, 13, 14, 15, 16, 19, 20, 23, 24, 25, 26, 27, 28]

# Runtime Data Files
PRESCRIBED_FILE_PATH = os.path.join(PROJECT_ROOT, "prescribed_session.json")
REPORT_FILE_PATH = os.path.join(PROJECT_ROOT, "clinical_session_report.json")
