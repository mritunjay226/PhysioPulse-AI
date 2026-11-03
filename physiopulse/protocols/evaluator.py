from .shoulder import evaluate_shoulder_abduction
from .knee import evaluate_knee_squat
from .cervical import evaluate_cervical_posture
from .elbow import evaluate_elbow_flexion
from .wall_slide import evaluate_wall_slide
from .hip import evaluate_hip_abduction
from .lumbar import evaluate_lumbar_hinge
from .wrist import evaluate_wrist_extension
from .base import ProtocolSessionState

def evaluate_protocol(
    mode: int,
    frame,
    all_pts,
    world_lm,
    world_filter,
    angle_filter,
    sym_filter,
    now_wall: float,
    dt: float,
    target_rom: int,
    baseline_calibrated: bool,
    relative_tilt: float,
    baseline_neck_deviation: float,
    shoulder_width: float,
    hips_clearly_visible: bool,
    coach,
    show_skeleton: bool,
    state: ProtocolSessionState
) -> int:
    """
    Executes biomechanical assessment for the active protocol (1 to 8),
    updates kinematics and compensation metrics, and renders visual indicators.
    """
    primary_angle = 0

    if mode == 1:
        primary_angle = evaluate_shoulder_abduction(
            frame, all_pts, world_lm, world_filter, angle_filter, now_wall, dt,
            target_rom, baseline_calibrated, relative_tilt, hips_clearly_visible,
            coach, show_skeleton, state
        )
    elif mode == 2:
        primary_angle = evaluate_knee_squat(
            frame, all_pts, world_lm, world_filter, angle_filter, now_wall, dt,
            target_rom, baseline_calibrated, coach, show_skeleton, state
        )
    elif mode == 3:
        primary_angle = evaluate_cervical_posture(
            frame, all_pts, angle_filter, now_wall, dt,
            baseline_calibrated, baseline_neck_deviation, shoulder_width,
            coach, show_skeleton, state
        )
    elif mode == 4:
        primary_angle = evaluate_elbow_flexion(
            frame, all_pts, world_lm, world_filter, angle_filter, now_wall, dt,
            target_rom, baseline_calibrated, hips_clearly_visible,
            coach, show_skeleton, state
        )
    elif mode == 5:
        primary_angle = evaluate_wall_slide(
            frame, all_pts, world_lm, world_filter, angle_filter, sym_filter, now_wall, dt,
            target_rom, baseline_calibrated, hips_clearly_visible,
            coach, show_skeleton, state
        )
    elif mode == 6:
        primary_angle = evaluate_hip_abduction(
            frame, all_pts, angle_filter, now_wall, dt,
            target_rom, baseline_calibrated,
            coach, show_skeleton, state
        )
    elif mode == 7:
        primary_angle = evaluate_lumbar_hinge(
            frame, all_pts, angle_filter, now_wall, dt,
            target_rom, baseline_calibrated, relative_tilt,
            coach, show_skeleton, state
        )
    elif mode == 8:
        primary_angle = evaluate_wrist_extension(
            frame, all_pts, angle_filter, now_wall, dt,
            target_rom, baseline_calibrated, relative_tilt,
            coach, show_skeleton, state
        )

    # Common kinematic derivative & compensation tally
    dt_vel = max(0.001, now_wall - state.prev_angle_time)
    state.angular_velocity = round(abs(primary_angle - state.prev_angle) / dt_vel, 1)
    state.prev_angle = primary_angle
    state.prev_angle_time = now_wall

    if state.is_bad_form:
        state.posture_errors += 1
        comp_name = state.form_status
        if "ASYMMETRY" in comp_name:
            comp_name = "COMPENSATION: BILATERAL ASYMMETRY"
        elif "POSTURE DRIFT" in comp_name:
            comp_name = "COMPENSATION: POSTURE DRIFT"
        state.compensation_reasons[comp_name] = state.compensation_reasons.get(comp_name, 0) + 1

    return primary_angle
