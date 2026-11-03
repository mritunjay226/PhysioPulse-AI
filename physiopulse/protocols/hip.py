from ..kinematics.angles import calculate_angle_2d
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint, draw_goniometer_arc

def evaluate_hip_abduction(
    frame, all_pts, angle_filter, now_wall, dt,
    target_rom, baseline_calibrated,
    coach, show_skeleton, state
):
    l_shoulder = all_pts[12]
    r_shoulder = all_pts[11]
    l_hip      = all_pts[24]
    r_hip      = all_pts[23]
    l_knee     = all_pts[26]
    r_knee     = all_pts[25]
    l_ankle    = all_pts[28]
    r_ankle    = all_pts[27]

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

    if primary_angle > state.max_rom:
        state.max_rom = primary_angle
    if primary_angle > state.max_rep_rom:
        state.max_rep_rom = primary_angle

    if trunk_lean > 18 and primary_angle > 14:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = "COMPENSATION: TRUNK LEAN"
            state.feedback_text = "Keep upper body vertical! Don't lean sideways."
            coach.speak("Do not lean your torso sideways.")
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "OPTIMAL PELVIC STABILITY"
            state.feedback_text = f"Lift leg out to the side smoothly (Target: {target_rom} deg)."

    abduct_target = max(18, target_rom - 6)
    abduct_return = 10

    if state.stage == "DOWN":
        if primary_angle > abduct_return:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= abduct_target and not state.is_bad_form:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 3:
                state.reached_peak = True
                state.stage = "UP"
                state.kinematic_phase = "PEAK"
    elif state.stage == "UP":
        if primary_angle < abduct_target - 5:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= abduct_return:
            state.stage = "DOWN"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.2:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Hip abduction complete.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, act_sh, act_h, color=draw_color, thickness=3)
        draw_clinical_bone(frame, act_h, act_k, color=draw_color, thickness=4)
        draw_clinical_bone(frame, act_k, act_a, color=draw_color, thickness=4)

        for pt in [act_sh, act_h, act_k, act_a]:
            draw_clinical_joint(frame, pt, color=draw_color, radius=7)

        draw_goniometer_arc(frame, act_h, spine_down, act_a, primary_angle, target_rom, is_bad=state.is_bad_form)

    if state.is_bad_form:
        state.active_correction_cue = "KEEP PELVIS LEVEL & TORSO VERTICAL"
        state.active_correction_direction = "UP"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
