from ..kinematics.angles import calculate_angle_2d
from ..rendering.visualizer import draw_clinical_bone, draw_clinical_joint

def evaluate_cervical_posture(
    frame, all_pts, angle_filter, now_wall, dt,
    baseline_calibrated, baseline_neck_deviation, shoulder_width,
    coach, show_skeleton, state
):
    nose       = all_pts[0]
    l_ear      = all_pts[8]
    r_ear      = all_pts[7]
    l_shoulder = all_pts[12]
    r_shoulder = all_pts[11]

    mid_shoulder = [(l_shoulder[0] + r_shoulder[0]) / 2, (l_shoulder[1] + r_shoulder[1]) / 2]
    vertical_up = [mid_shoulder[0], mid_shoulder[1] - 200]
    neck_deviation = calculate_angle_2d(vertical_up, mid_shoulder, nose)

    rel_neck_drift = abs(neck_deviation - baseline_neck_deviation) if baseline_calibrated else 0.0
    raw_cervical_score = max(0, min(100, int(100 - rel_neck_drift * 3.5)))
    primary_angle = angle_filter.update(raw_cervical_score, now_wall)

    ear_tilt_ratio = abs(l_ear[1] - r_ear[1]) / shoulder_width
    state.max_rom = max(state.max_rom, primary_angle)

    if baseline_calibrated and (state.symmetry_score < 72 or rel_neck_drift > 13 or ear_tilt_ratio > 0.15):
        state.bad_frame_streak += 1
        if state.bad_frame_streak >= 8:
            state.is_bad_form = True
            state.form_status = "POSTURE DRIFT DETECTED"
            state.feedback_text = f"Neck drift: {int(rel_neck_drift)} deg | Retract chin & align shoulders!"
            coach.speak("Align your neck and shoulders.")
            state.kinematic_phase = "POSTURE DRIFT"
            state.p3_hold_timer = max(0.0, state.p3_hold_timer - dt * 0.8)
    else:
        state.bad_frame_streak = max(0, state.bad_frame_streak - 1)
        if baseline_calibrated:
            state.is_bad_form = False
            state.form_status = "ERGONOMIC ALIGNMENT"
            state.p3_hold_timer += dt
            state.feedback_text = f"Alignment: {primary_angle}% | Hold: {round(state.p3_hold_timer, 1)}s/5.0s"
            state.kinematic_phase = "ISOMETRIC HOLD"
            if state.p3_hold_timer >= 5.0:
                state.reps += 1
                state.p3_hold_timer = 0.0
                coach.speak(f"Posture hold {state.reps} complete. Keep aligned.", force=True)

    if show_skeleton:
        active_color = (0, 240, 200)
        draw_color = (60, 60, 255) if state.is_bad_form else active_color
        draw_clinical_bone(frame, mid_shoulder, vertical_up, color=(100, 110, 120), thickness=2, glow_ratio=0.2)
        draw_clinical_bone(frame, l_shoulder, r_shoulder, color=draw_color, thickness=4)
        draw_clinical_bone(frame, mid_shoulder, nose, color=draw_color, thickness=3)
        draw_clinical_bone(frame, l_ear, r_ear, color=(180, 200, 220), thickness=2, glow_ratio=0.2)

        for pt in [l_shoulder, r_shoulder, mid_shoulder, nose, l_ear, r_ear]:
            draw_clinical_joint(frame, pt, color=draw_color, radius=6)

    if state.is_bad_form:
        state.active_correction_cue = "RETRACT CHIN / ALIGN SPINE"
        state.active_correction_direction = "UP"
    else:
        state.active_correction_cue = None
        state.active_correction_direction = None

    return primary_angle
