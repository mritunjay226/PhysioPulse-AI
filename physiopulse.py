#!/usr/bin/env python3
"""
PhysioPulse AI — Autonomous Markerless Telerehabilitation & Kinematic Intelligence.
Root Entrypoint & Backward-Compatible Facade.

The engine has been modularized into the `physiopulse` package:
  - physiopulse/engine.py: Core runner and session state machine
  - physiopulse/camera.py: ZeroLatencyCamera DirectShow capture thread
  - physiopulse/audio.py: Non-blocking VoiceCoach TTS engine
  - physiopulse/server.py: Embedded HTTP & MJPEG video streamer
  - physiopulse/filters/: Adaptive 1-Euro signal smoothing filters
  - physiopulse/kinematics/: Biomechanical angles and 2D/3D fusion math
  - physiopulse/rendering/: Clinical bone, joint, goniometer & HUD visualizers
  - physiopulse/protocols/: The 8 clinical rehabilitation protocols & evaluators
"""

import sys
import os

# Ensure package root is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# Guard against Windows Application Control / Smart App Control blocking unused matplotlib DLLs
try:
    import matplotlib
except Exception:
    from unittest.mock import MagicMock
    dummy = MagicMock()
    sys.modules["matplotlib"] = dummy
    sys.modules["matplotlib.pyplot"] = dummy

from physiopulse.engine import main, run_engine
from physiopulse.camera import ZeroLatencyCamera
from physiopulse.audio import VoiceCoach
from physiopulse.server import VideoStreamHandler, start_embedded_server
from physiopulse.filters.one_euro import (
    OneEuroFilter,
    PointOneEuroFilter,
    World3DOneEuroFilter,
    ValueOneEuroFilter
)
from physiopulse.kinematics.angles import (
    calculate_angle_2d,
    calculate_angle_3d_vec,
    get_fused_angle,
    to_point_int,
    _pt_i
)
from physiopulse.rendering.visualizer import (
    draw_clinical_bone,
    draw_clinical_joint,
    draw_goniometer_arc,
    draw_ghost_skeleton,
    draw_desktop_hud
)
from physiopulse.protocols.registry import MODE_NAMES, PROTOCOL_GUIDE, REQ_LANDMARKS
from physiopulse.protocols.evaluator import evaluate_protocol
from physiopulse.protocols.base import ProtocolSessionState
import physiopulse.state as state

if __name__ == "__main__":
    main()
