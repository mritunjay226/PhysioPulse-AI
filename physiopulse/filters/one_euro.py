import numpy as np

class OneEuroFilter:
    """
    Adaptive 1-Euro Filter: Zero jitter when stationary, zero phase lag when moving.
    Formulated by Casiez, Roussel, and Vogel (CHI 2012).
    """
    def __init__(self, t0, x0, min_cutoff=1.0, beta=0.007, d_cutoff=1.0):
        self.min_cutoff = float(min_cutoff)
        self.beta = float(beta)
        self.d_cutoff = float(d_cutoff)
        self.x_prev = float(x0)
        self.dx_prev = 0.0
        self.t_prev = float(t0)

    def filter(self, t, x):
        t_e = max(1e-4, t - self.t_prev)
        a_d = self._smoothing_factor(t_e, self.d_cutoff)
        dx = (x - self.x_prev) / t_e
        dx_hat = a_d * dx + (1.0 - a_d) * self.dx_prev
        cutoff = self.min_cutoff + self.beta * abs(dx_hat)
        a = self._smoothing_factor(t_e, cutoff)
        x_hat = a * x + (1.0 - a) * self.x_prev
        self.x_prev = x_hat
        self.dx_prev = dx_hat
        self.t_prev = t
        return x_hat

    @staticmethod
    def _smoothing_factor(t_e, cutoff):
        r = 2 * np.pi * cutoff * t_e
        return r / (r + 1.0)


class PointOneEuroFilter:
    """Adaptive 1-Euro 2D landmark filter with sub-pixel float precision."""
    def __init__(self, min_cutoff=1.15, beta=0.015, d_cutoff=1.0):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.d_cutoff = d_cutoff
        self.filters = {}

    def smooth(self, idx, pt, t):
        x, y = float(pt[0]), float(pt[1])
        if idx not in self.filters:
            self.filters[idx] = (
                OneEuroFilter(t, x, self.min_cutoff, self.beta, self.d_cutoff),
                OneEuroFilter(t, y, self.min_cutoff, self.beta, self.d_cutoff)
            )
            return [x, y]
        fx, fy = self.filters[idx]
        return [fx.filter(t, x), fy.filter(t, y)]

    def reset(self):
        self.filters.clear()


class World3DOneEuroFilter:
    """Adaptive 1-Euro 3D metric world landmark filter with Z-depth stabilization."""
    def __init__(self, min_cutoff=0.9, beta=0.01, d_cutoff=1.0):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.d_cutoff = d_cutoff
        self.filters = {}

    def smooth(self, idx, w_lm, t):
        x, y, z = float(w_lm.x), float(w_lm.y), float(w_lm.z)
        if idx not in self.filters:
            self.filters[idx] = (
                OneEuroFilter(t, x, self.min_cutoff, self.beta, self.d_cutoff),
                OneEuroFilter(t, y, self.min_cutoff, self.beta, self.d_cutoff),
                OneEuroFilter(t, z, self.min_cutoff * 0.65, self.beta * 0.5, self.d_cutoff)
            )
            return np.array([x, y, z], dtype=np.float32)
        fx, fy, fz = self.filters[idx]
        return np.array([fx.filter(t, x), fy.filter(t, y), fz.filter(t, z)], dtype=np.float32)

    def reset(self):
        self.filters.clear()


class ValueOneEuroFilter:
    """Adaptive 1-Euro continuous angle & symmetry filter."""
    def __init__(self, min_cutoff=0.95, beta=0.012):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.f = None

    def update(self, val, t):
        val = float(val)
        if self.f is None:
            self.f = OneEuroFilter(t, val, self.min_cutoff, self.beta)
            return int(round(val))
        return int(round(self.f.filter(t, val)))
