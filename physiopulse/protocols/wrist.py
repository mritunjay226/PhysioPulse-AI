from ..kinematics.angles import calculate_angle_2d
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint, draw_goniometer_arc

def evaluate_wrist_extension(
    frame, all_pts, angle_filter, now_wall, dt,
    target_rom, baseline_calibrated, relative_tilt,
    coach, show_skeleton, state
):
    l_elbow = all_pts[14]
    r_elbow = all_pts[13]
    l_wrist = all_pts[16]
    r_wrist = all_pts[15]
    l_index = all_pts[20]
    r_index = all_pts[19]

    raw_l = calculate_angle_2d(l_elbow, l_wrist, l_index)
    raw_r = calculate_angle_2d(r_elbow, r_wrist, r_index)
    dev_l = abs(180.0 - raw_l)
    dev_r = abs(180.0 - raw_r)

    if dev_r > dev_l + 4:
        act_el, act_wr, act_idx = r_elbow, r_wrist, r_index
        raw_dev = dev_r
    else:
        act_el, act_wr, act_idx = l_elbow, l_wrist, l_index
        raw_dev = dev_l

    wrist_deviation = angle_filter.update(raw_dev, now_wall)
    primary_angle = wrist_deviation

    if wrist_deviation > state.max_rom:
        state.max_rom = wrist_deviation
    if wrist_deviation > state.max_rep_rom:
        state.max_rep_rom = wrist_deviation

    if baseline_calibrated and relative_tilt > 0.17:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = "COMPENSATION: SHOULDER TENSION"
            state.feedback_text = "Relax your shoulder down while flexing wrist!"
            coach.speak("Relax your shoulder while moving your wrist.")
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "OPTIMAL TENDON GLIDE"
            state.feedback_text = f"Wrist Flex/Ext: {wrist_deviation} deg (Target: {target_rom} deg)"

    wrist_target = max(16, target_rom - 5)
    wrist_return = 8

    if state.stage == "DOWN":
        if primary_angle > wrist_return:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= wrist_target and not state.is_bad_form:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 2:
                state.reached_peak = True
                state.stage = "UP"
                state.kinematic_phase = "PEAK"
    elif state.stage == "UP":
        if primary_angle < wrist_target - 4:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= wrist_return:
            state.stage = "DOWN"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.0:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Good tendon glide.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, act_el, act_wr, color=draw_color, thickness=4)
        draw_clinical_bone(frame, act_wr, act_idx, color=draw_color, thickness=3)

        for pt in [act_el, act_wr, act_idx]:
            draw_clinical_joint(frame, pt, color=draw_color, radius=6)

        draw_goniometer_arc(frame, act_wr, act_el, act_idx, primary_angle, target_rom, is_bad=state.is_bad_form)

    if state.is_bad_form:
        state.active_correction_cue = "RELAX SHOULDER & STABILIZE FOREARM"
        state.active_correction_direction = "DOWN"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
