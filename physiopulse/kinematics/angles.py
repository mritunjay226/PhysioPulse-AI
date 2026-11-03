import numpy as np

def calculate_angle_2d(a, b, c) -> float:
    """2D vector dot-product angle (0-180 deg) at vertex b with floating-point precision."""
    a, b, c = np.array(a, dtype=np.float32), np.array(b, dtype=np.float32), np.array(c, dtype=np.float32)
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba < 1e-6 or norm_bc < 1e-6:
        return 0.0
    cos_angle = np.clip(np.dot(ba, bc) / (norm_ba * norm_bc), -1.0, 1.0)
    return float(np.degrees(np.arccos(cos_angle)))


def calculate_angle_3d_vec(va, vb, vc, z_weight: float = 0.48) -> float:
    """True 3D Euclidean angle in degrees with Z-depth noise dampening for monocular webcams."""
    a = np.array([va[0], va[1], va[2] * z_weight], dtype=np.float32)
    b = np.array([vb[0], vb[1], vb[2] * z_weight], dtype=np.float32)
    c = np.array([vc[0], vc[1], vc[2] * z_weight], dtype=np.float32)
    ba = a - b
    bc = c - b
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba < 1e-6 or norm_bc < 1e-6:
        return 0.0
    cos_angle = np.clip(np.dot(ba, bc) / (norm_ba * norm_bc), -1.0, 1.0)
    return float(np.degrees(np.arccos(cos_angle)))


def get_fused_angle(world_lm, world_filter, now_t, pt_a_2d, pt_b_2d, pt_c_2d, idx_a, idx_b, idx_c, z_weight: float = 0.48) -> float:
    """Blends smoothed 2D screen geometry (65%) with smoothed, Z-dampened 3D world geometry (35%)."""
    ang_2d = calculate_angle_2d(pt_a_2d, pt_b_2d, pt_c_2d)
    if not world_lm or max(idx_a, idx_b, idx_c) >= len(world_lm):
        return ang_2d
    wa, wb, wc = world_lm[idx_a], world_lm[idx_b], world_lm[idx_c]
    v_min = min(
        getattr(wa, 'visibility', 1.0) or 1.0,
        getattr(wb, 'visibility', 1.0) or 1.0,
        getattr(wc, 'visibility', 1.0) or 1.0
    )
    if v_min < 0.45:
        return ang_2d
    va = world_filter.smooth(idx_a, wa, now_t)
    vb = world_filter.smooth(idx_b, wb, now_t)
    vc = world_filter.smooth(idx_c, wc, now_t)
    ang_3d = calculate_angle_3d_vec(va, vb, vc, z_weight=z_weight)
    return 0.65 * ang_2d + 0.35 * ang_3d


def to_point_int(pt):
    """Converts continuous (x, y) float landmark coordinates to integer screen coordinates."""
    return (int(round(float(pt[0]))), int(round(float(pt[1]))))

# Backward-compatible alias
_pt_i = to_point_int
