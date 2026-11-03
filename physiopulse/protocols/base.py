from dataclasses import dataclass, field
from typing import Dict, Any, List

@dataclass
class ProtocolSessionState:
    """Holds exercise progression and kinematic state variables across frames."""
    reps: int = 0
    stage: str = "DOWN"
    max_rom: int = 0
    max_rep_rom: int = 0
    bad_frame_streak: int = 0
    is_bad_form: bool = False
    posture_errors: int = 0
    form_status: str = "CALIBRATING..."
    feedback_text: str = "Position yourself in frame to begin..."
    active_correction_cue: Any = None
    active_correction_direction: Any = None
    peak_hold_frames: int = 0
    reached_peak: bool = False
    last_rep_time: float = 0.0
    angular_velocity: float = 0.0
    prev_angle: float = 0.0
    prev_angle_time: float = 0.0
    kinematic_phase: str = "REST"
    symmetry_score: int = 100
    p3_hold_timer: float = 0.0
    compensation_reasons: Dict[str, int] = field(default_factory=dict)
    symmetry_samples: List[int] = field(default_factory=list)

    def reset_for_protocol(self, mode: int):
        self.reps = 0
        self.max_rom = 0
        self.max_rep_rom = 0
        self.bad_frame_streak = 0
        self.is_bad_form = False
        self.posture_errors = 0
        self.form_status = "OPTIMAL BIOMECHANICS"
        self.feedback_text = "Perform prescribed motion smoothly."
        self.active_correction_cue = None
        self.active_correction_direction = None
        self.peak_hold_frames = 0
        self.reached_peak = False
        self.last_rep_time = 0.0
        self.angular_velocity = 0.0
        self.prev_angle = 0.0
        self.prev_angle_time = 0.0
        self.kinematic_phase = "REST"
        self.symmetry_score = 100
        self.p3_hold_timer = 0.0
        self.compensation_reasons.clear()
        self.symmetry_samples.clear()
        self.stage = "DOWN" if mode not in [2, 7] else "UP"
