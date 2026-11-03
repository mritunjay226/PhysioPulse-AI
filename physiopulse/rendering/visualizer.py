import cv2
import numpy as np
from ..kinematics.angles import to_point_int

def draw_clinical_bone(img, pt1, pt2, color=(0, 240, 200), thickness=3, glow_ratio=0.42):
    p1 = to_point_int(pt1)
    p2 = to_point_int(pt2)
    glow_col = (color[0] // 3, color[1] // 3, color[2] // 3)
    cv2.line(img, p1, p2, glow_col, thickness * 2 + 2, cv2.LINE_AA)
    cv2.line(img, p1, p2, color, thickness, cv2.LINE_AA)
    cv2.line(img, p1, p2, (255, 255, 255), max(1, thickness - 2), cv2.LINE_AA)


def draw_clinical_joint(img, pt, color=(0, 240, 200), radius=7):
    p = to_point_int(pt)
    glow_col = (color[0] // 3, color[1] // 3, color[2] // 3)
    cv2.circle(img, p, radius + 4, glow_col, 2, cv2.LINE_AA)
    cv2.circle(img, p, radius, color, -1, cv2.LINE_AA)
    cv2.circle(img, p, max(2, radius - 3), (255, 255, 255), -1, cv2.LINE_AA)


def draw_goniometer_arc(img, center, pt1, pt2, angle, target_angle, is_bad=False, radius=46):
    v1 = np.array(pt1, dtype=np.float32) - np.array(center, dtype=np.float32)
    v2 = np.array(pt2, dtype=np.float32) - np.array(center, dtype=np.float32)
    n1 = np.linalg.norm(v1)
    n2 = np.linalg.norm(v2)
    if n1 == 0 or n2 == 0:
        return
    ang1 = float(np.degrees(np.arctan2(v1[1], v1[0]))) % 360
    ang2 = float(np.degrees(np.arctan2(v2[1], v2[0]))) % 360

    start_ang = min(ang1, ang2)
    end_ang = max(ang1, ang2)
    if end_ang - start_ang > 180:
        start_ang, end_ang = end_ang, start_ang + 360

    is_hit = angle >= target_angle
    color = (60, 60, 255) if is_bad else ((0, 255, 128) if is_hit else (0, 240, 200))
    glow_col = (color[0] // 3, color[1] // 3, color[2] // 3)
    c = to_point_int(center)

    cv2.ellipse(img, c, (radius, radius), 0, start_ang, end_ang, glow_col, 5, cv2.LINE_AA)
    cv2.ellipse(img, c, (radius, radius), 0, start_ang, end_ang, color, 2, cv2.LINE_AA)

    if is_hit and not is_bad:
        cv2.circle(img, c, radius + 8, (0, 255, 128), 1, cv2.LINE_AA)
        cv2.circle(img, c, radius + 11, (0, 120, 60), 1, cv2.LINE_AA)


def draw_ghost_skeleton(img, landmarks_pts):
    CONNECTIONS = [
        (11, 12), (11, 23), (12, 24), (23, 24),
        (12, 14), (14, 16),
        (11, 13), (13, 15),
        (24, 26), (26, 28),
        (23, 25), (25, 27)
    ]
    ghost_color = (60, 68, 78)
    for i, j in CONNECTIONS:
        if i in landmarks_pts and j in landmarks_pts:
            cv2.line(img, to_point_int(landmarks_pts[i]), to_point_int(landmarks_pts[j]), ghost_color, 1, cv2.LINE_AA)


def draw_desktop_hud(disp_frame, title_text, instr_text, reps, target_reps, primary_angle, target_rom, fps):
    h_f, w_f = disp_frame.shape[:2]
    cv2.rectangle(disp_frame, (0, 0), (w_f, 68), (14, 18, 24), -1)
    cv2.line(disp_frame, (0, 68), (w_f, 68), (0, 240, 200), 2)

    cv2.putText(disp_frame, title_text, (16, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 200), 2, cv2.LINE_AA)
    hud_instr = f"ACTION: {instr_text}  |  FPS: {fps}"
    cv2.putText(disp_frame, hud_instr, (16, 52), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (220, 230, 240), 1, cv2.LINE_AA)

    hud_stats = f"Reps: {reps}/{target_reps} | ROM: {primary_angle}d/{target_rom}d"
    cv2.putText(disp_frame, hud_stats, (w_f - 260, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1, cv2.LINE_AA)
