from ..kinematics.angles import calculate_angle_2d, get_fused_angle
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint, draw_goniometer_arc

def evaluate_shoulder_abduction(
    frame, all_pts, world_lm, world_filter, angle_filter, now_wall, dt,
    target_rom, baseline_calibrated, relative_tilt, hips_clearly_visible,
    coach, show_skeleton, state
):
    l_shoulder = all_pts[12]
    r_shoulder = all_pts[11]
    l_elbow    = all_pts[14]
    r_elbow    = all_pts[13]
    l_wrist    = all_pts[16]
    r_wrist    = all_pts[15]
    l_hip      = all_pts[24]
    r_hip      = all_pts[23]

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

    dt_vel = max(0.001, now_wall - state.prev_angle_time)
    state.angular_velocity = round(abs(primary_angle - state.prev_angle) / dt_vel, 1)

    if primary_angle > state.max_rom:
        state.max_rom = primary_angle
    if primary_angle > state.max_rep_rom:
        state.max_rep_rom = primary_angle

    frame_error = False
    err_type = ""
    err_msg = ""
    if baseline_calibrated and relative_tilt > 0.17 and primary_angle > 42:
        frame_error = True
        err_type = "COMPENSATION: SHRUGGING"
        err_msg = "Keep shoulders level! Do not shrug."
    elif elbow_straightness < 128 and primary_angle > 40:
        frame_error = True
        err_type = "COMPENSATION: BENT ELBOW"
        err_msg = "Keep your arm straight as you raise it."

    if frame_error:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = err_type
            state.feedback_text = err_msg
            coach.speak(err_msg)
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "OPTIMAL BIOMECHANICS"
            state.feedback_text = f"Raise arm smoothly (Target: {target_rom} deg)."

    abduction_target = max(65, target_rom - 10)
    return_threshold = 32

    if state.stage == "DOWN":
        if primary_angle > return_threshold:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= abduction_target and not state.is_bad_form and state.angular_velocity < 175:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 3:
                state.reached_peak = True
                state.stage = "UP"
                state.kinematic_phase = "PEAK"
    elif state.stage == "UP":
        if primary_angle < abduction_target - 10:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= return_threshold:
            state.stage = "DOWN"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.1:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Peak {state.max_rep_rom} degrees.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, act_sh, act_ref, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
        draw_clinical_bone(frame, act_sh, act_el, color=draw_color, thickness=4)
        draw_clinical_bone(frame, act_el, act_wr, color=draw_color, thickness=4)
        draw_clinical_bone(frame, l_shoulder, r_shoulder, color=(180, 200, 220), thickness=2, glow_ratio=0.2)

        draw_clinical_joint(frame, act_sh, color=draw_color, radius=8)
        draw_clinical_joint(frame, act_el, color=draw_color, radius=7)
        draw_clinical_joint(frame, act_wr, color=draw_color, radius=6)
        draw_clinical_joint(frame, opp_sh, color=(180, 200, 220), radius=6)

        draw_goniometer_arc(frame, act_sh, act_ref, act_el, primary_angle, target_rom, is_bad=state.is_bad_form)

    if state.is_bad_form:
        if "SHRUGGING" in state.form_status:
            state.active_correction_cue = "LOWER ELEVATED SHOULDER"
            state.active_correction_direction = "DOWN"
        elif "BENT ELBOW" in state.form_status:
            state.active_correction_cue = "EXTEND ELBOW OUTWARD"
            state.active_correction_direction = "OUT"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
