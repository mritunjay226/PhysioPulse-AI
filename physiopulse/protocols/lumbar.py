from ..kinematics.angles import calculate_angle_2d
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint, draw_goniometer_arc

def evaluate_lumbar_hinge(
    frame, all_pts, angle_filter, now_wall, dt,
    target_rom, baseline_calibrated, relative_tilt,
    coach, show_skeleton, state
):
    l_shoulder = all_pts[12]
    r_shoulder = all_pts[11]
    l_hip      = all_pts[24]

    torso_vert = [l_hip[0], l_hip[1] - 200]
    raw_hinge = calculate_angle_2d(torso_vert, l_hip, l_shoulder)
    primary_angle = angle_filter.update(raw_hinge, now_wall)

    if primary_angle > state.max_rom:
        state.max_rom = primary_angle
    if primary_angle > state.max_rep_rom:
        state.max_rep_rom = primary_angle

    if baseline_calibrated and relative_tilt > 0.18 and primary_angle > 18:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = "COMPENSATION: SPINAL TWIST"
            state.feedback_text = "Keep shoulders square! Do not twist your lower back."
            coach.speak("Keep your spine symmetrical. Do not twist.")
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "OPTIMAL LUMBAR MECHANICS"
            state.feedback_text = f"Hinge forward gently (Target: {target_rom} deg), then return upright."

    hinge_target = max(22, min(target_rom - 5, 50))
    upright_threshold = 10

    if state.stage == "UP":
        if primary_angle > upright_threshold:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= hinge_target and not state.is_bad_form:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 3:
                state.reached_peak = True
                state.stage = "DOWN"
                state.kinematic_phase = "PEAK"
    elif state.stage == "DOWN":
        if primary_angle < hinge_target - 6:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= upright_threshold:
            state.stage = "UP"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.2:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Smooth lumbar hinge.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, l_hip, torso_vert, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
        draw_clinical_bone(frame, l_hip, l_shoulder, color=draw_color, thickness=4)
        draw_clinical_bone(frame, l_shoulder, r_shoulder, color=draw_color, thickness=3)

        for pt in [l_hip, l_shoulder, r_shoulder]:
            draw_clinical_joint(frame, pt, color=draw_color, radius=7)

        draw_goniometer_arc(frame, l_hip, torso_vert, l_shoulder, primary_angle, target_rom, is_bad=state.is_bad_form)

    if state.is_bad_form:
        state.active_correction_cue = "MAINTAIN FLAT BACK / SPINE ALIGNMENT"
        state.active_correction_direction = "UP"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
