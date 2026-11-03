from ..kinematics.angles import calculate_angle_2d, get_fused_angle
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint, draw_goniometer_arc

def evaluate_elbow_flexion(
    frame, all_pts, world_lm, world_filter, angle_filter, now_wall, dt,
    target_rom, baseline_calibrated, hips_clearly_visible,
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

    if primary_angle > state.max_rom:
        state.max_rom = primary_angle
    if primary_angle > state.max_rep_rom:
        state.max_rep_rom = primary_angle

    if upper_arm_drift > 28 and primary_angle > 38:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = "COMPENSATION: ELBOW DRIFT"
            state.feedback_text = "Pin your elbow close to your ribs! Don't swing."
            coach.speak("Keep your elbow pinned to your side.")
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "OPTIMAL BIOMECHANICS"
            state.feedback_text = f"Curl hand upward toward shoulder (Target: {target_rom} deg)."

    flexion_target = max(80, target_rom - 15)
    extension_threshold = 38

    if state.stage == "DOWN":
        if primary_angle > extension_threshold:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= flexion_target and not state.is_bad_form:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 3:
                state.reached_peak = True
                state.stage = "UP"
                state.kinematic_phase = "PEAK"
    elif state.stage == "UP":
        if primary_angle < flexion_target - 10:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= extension_threshold:
            state.stage = "DOWN"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.1:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Full curl complete.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, act_sh, act_ref, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
        draw_clinical_bone(frame, act_sh, act_el, color=draw_color, thickness=4)
        draw_clinical_bone(frame, act_el, act_wr, color=draw_color, thickness=4)

        draw_clinical_joint(frame, act_sh, color=draw_color, radius=7)
        draw_clinical_joint(frame, act_el, color=draw_color, radius=8)
        draw_clinical_joint(frame, act_wr, color=draw_color, radius=6)

        draw_goniometer_arc(frame, act_el, act_sh, act_wr, primary_angle, target_rom, is_bad=state.is_bad_form)

    if state.is_bad_form:
        state.active_correction_cue = "PIN ELBOW TO TORSO"
        state.active_correction_direction = "DOWN"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
