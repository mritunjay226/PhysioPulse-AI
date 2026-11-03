from ..kinematics.angles import calculate_angle_2d, get_fused_angle
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint

def evaluate_wall_slide(
    frame, all_pts, world_lm, world_filter, angle_filter, sym_filter, now_wall, dt,
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

    ref_l = l_hip if hips_clearly_visible else [l_shoulder[0], l_shoulder[1] + 200]
    ref_r = r_hip if hips_clearly_visible else [r_shoulder[0], r_shoulder[1] + 200]

    if hips_clearly_visible:
        l_ang = get_fused_angle(world_lm, world_filter, now_wall, ref_l, l_shoulder, l_elbow, 24, 12, 14)
        r_ang = get_fused_angle(world_lm, world_filter, now_wall, ref_r, r_shoulder, r_elbow, 23, 11, 13)
    else:
        l_ang = calculate_angle_2d(ref_l, l_shoulder, l_elbow)
        r_ang = calculate_angle_2d(ref_r, r_shoulder, r_elbow)

    primary_angle = angle_filter.update((l_ang + r_ang) / 2.0, now_wall)
    arm_diff = abs(l_ang - r_ang)
    state.symmetry_score = sym_filter.update(max(0, min(100, int(100 - arm_diff * 1.8))), now_wall)

    if primary_angle > state.max_rom:
        state.max_rom = primary_angle
    if primary_angle > state.max_rep_rom:
        state.max_rep_rom = primary_angle

    if arm_diff > 20 and primary_angle > 48:
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = f"ASYMMETRY: {int(arm_diff)} DEG GAP"
            state.feedback_text = "Raise both arms at the exact same height!"
            coach.speak("Arm asymmetry detected. Level both arms.")
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "BILATERAL SYNC OPTIMAL"
            state.feedback_text = f"L: {int(l_ang)} deg | R: {int(r_ang)} deg (Raise both overhead)"

    slide_target = max(95, target_rom - 15)
    slide_return = 45

    if state.stage == "DOWN":
        if primary_angle > slide_return:
            state.kinematic_phase = "CONCENTRIC"
        if primary_angle >= slide_target and not state.is_bad_form:
            state.peak_hold_frames += 1
            if state.peak_hold_frames >= 3:
                state.reached_peak = True
                state.stage = "UP"
                state.kinematic_phase = "PEAK"
    elif state.stage == "UP":
        if primary_angle < slide_target - 10:
            state.kinematic_phase = "ECCENTRIC"
        if primary_angle <= slide_return:
            state.stage = "DOWN"
            state.kinematic_phase = "REST"
            state.peak_hold_frames = 0
            if state.reached_peak and (now_wall - state.last_rep_time) > 1.2:
                state.reps += 1
                state.last_rep_time = now_wall
                state.reached_peak = False
                coach.speak(f"Rep {state.reps}. Bilateral slide complete.", force=True)
                state.max_rep_rom = 0

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, l_shoulder, l_elbow, color=draw_color, thickness=4)
        draw_clinical_bone(frame, l_elbow, l_wrist, color=draw_color, thickness=4)
        draw_clinical_bone(frame, r_shoulder, r_elbow, color=draw_color, thickness=4)
        draw_clinical_bone(frame, r_elbow, r_wrist, color=draw_color, thickness=4)

        for pt in [l_shoulder, l_elbow, l_wrist, r_shoulder, r_elbow, r_wrist]:
            draw_clinical_joint(frame, pt, color=draw_color, radius=7)

    if state.is_bad_form:
        state.active_correction_cue = "BALANCE BOTH ARMS & AVOID SHRUGGING"
        state.active_correction_direction = "DOWN"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
