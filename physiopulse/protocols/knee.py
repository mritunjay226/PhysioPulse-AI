from ..kinematics.angles import calculate_angle_2d, get_fused_angle
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint, draw_goniometer_arc

def evaluate_knee_squat(
    frame, all_pts, world_lm, world_filter, angle_filter, now_wall, dt,
    target_rom, baseline_calibrated, coach, show_skeleton, state
):
    l_shoulder = all_pts[12]
    l_hip      = all_pts[24]
    r_hip      = all_pts[23]
    l_knee     = all_pts[26]
    r_knee     = all_pts[25]
    l_ankle    = all_pts[28]
    r_ankle    = all_pts[27]

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

    if primary_angle > state.max_rom:
        state.max_rom = primary_angle
    if primary_angle > state.max_rep_rom:
        state.max_rep_rom = primary_angle

    if torso_lean < 62 and primary_angle > 35:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = "COMPENSATION: FORWARD LEAN"
            state.feedback_text = "Keep your chest upright and spine neutral!"
            coach.speak("Keep your chest up.")
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "OPTIMAL BIOMECHANICS"
            state.feedback_text = f"Lower hips until knee reaches {target_rom} degrees."

    flexion_target = max(60, target_rom - 10)
    standing_threshold = 26

    if state.stage == "UP":
        if primary_angle > standing_threshold:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= flexion_target and not state.is_bad_form:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 3:
                state.reached_peak = True
                state.stage = "DOWN"
                state.kinematic_phase = "PEAK"
    elif state.stage == "DOWN":
        if primary_angle < flexion_target - 10:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= standing_threshold:
            state.stage = "UP"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.2:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Squat completed.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, l_shoulder, act_h, color=draw_color, thickness=3)
        draw_clinical_bone(frame, act_h, act_k, color=draw_color, thickness=4)
        draw_clinical_bone(frame, act_k, act_a, color=draw_color, thickness=4)

        draw_clinical_joint(frame, act_h, color=draw_color, radius=7)
        draw_clinical_joint(frame, act_k, color=draw_color, radius=9)
        draw_clinical_joint(frame, act_a, color=draw_color, radius=7)

        draw_goniometer_arc(frame, act_k, act_h, act_a, primary_angle, target_rom, is_bad=state.is_bad_form)

    if state.is_bad_form:
        state.active_correction_cue = "KEEP CHEST UPRIGHT"
        state.active_correction_direction = "UP"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
