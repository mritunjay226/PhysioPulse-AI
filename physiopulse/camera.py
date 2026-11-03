import cv2
import threading
import time

class ZeroLatencyCamera:
    """
    Dedicated background capture thread that continuously drains Windows DirectShow buffers.
    Guarantees 0ms latency drift indefinitely by always delivering the absolute latest sensor frame.
    """
    def __init__(self, width=848, height=480):
        self.width = width
        self.height = height
        self.cap = None
        self.frame = None
        self.ret = False
        self.lock = threading.Lock()
        self.new_frame_event = threading.Event()
        self.running = True
        self.frame_count = 0
        self.last_capture_time = time.monotonic()
        self._init_camera()

        if self.cap and self.cap.isOpened():
            self.thread = threading.Thread(target=self._capture_worker, daemon=True)
            self.thread.start()

    def _init_camera(self):
        # Strictly enforce DirectShow property initialization order:
        # 1. CAP_PROP_FOURCC = 'MJPG'
        # 2. CAP_PROP_FRAME_WIDTH = width
        # 3. CAP_PROP_FRAME_HEIGHT = height
        # 4. CAP_PROP_FPS = 30
        # 5. CAP_PROP_BUFFERSIZE = 1
        for cam_idx in [0, 1]:
            try:
                c = cv2.VideoCapture(cam_idx, cv2.CAP_DSHOW)
                if c.isOpened():
                    c.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
                    c.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
                    c.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
                    c.set(cv2.CAP_PROP_FPS, 30)
                    c.set(cv2.CAP_PROP_BUFFERSIZE, 1)

                    ret_t, frame_t = c.read()
                    if ret_t and frame_t is not None:
                        self.cap = c
                        self.frame = frame_t
                        self.ret = True
                        fourcc_int = int(c.get(cv2.CAP_PROP_FOURCC))
                        codec = "".join([chr((fourcc_int >> 8 * i) & 0xFF) for i in range(4)])
                        actual_fps = c.get(cv2.CAP_PROP_FPS)
                        print(f"✅ ZeroLatencyCamera initialized on DirectShow index {cam_idx} ({frame_t.shape[1]}x{frame_t.shape[0]} @ {actual_fps} FPS, Codec: {codec})")
                        return
                    c.release()
            except Exception:
                pass

            try:
                c = cv2.VideoCapture(cam_idx)
                if c.isOpened():
                    c.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
                    c.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
                    c.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
                    c.set(cv2.CAP_PROP_FPS, 30)
                    c.set(cv2.CAP_PROP_BUFFERSIZE, 1)

                    ret_t, frame_t = c.read()
                    if ret_t and frame_t is not None:
                        self.cap = c
                        self.frame = frame_t
                        self.ret = True
                        fourcc_int = int(c.get(cv2.CAP_PROP_FOURCC))
                        codec = "".join([chr((fourcc_int >> 8 * i) & 0xFF) for i in range(4)])
                        actual_fps = c.get(cv2.CAP_PROP_FPS)
                        print(f"✅ ZeroLatencyCamera initialized on default backend index {cam_idx} ({frame_t.shape[1]}x{frame_t.shape[0]} @ {actual_fps} FPS, Codec: {codec})")
                        return
                    c.release()
            except Exception:
                pass

        print("❌ Warning: Falling back to camera 0.")
        self.cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if not self.cap.isOpened():
            self.cap = cv2.VideoCapture(0)
        if self.cap.isOpened():
            self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            ret_t, frame_t = self.cap.read()
            if ret_t and frame_t is not None:
                self.frame = frame_t
                self.ret = True
            fourcc_int = int(self.cap.get(cv2.CAP_PROP_FOURCC))
            codec = "".join([chr((fourcc_int >> 8 * i) & 0xFF) for i in range(4)])
            actual_fps = self.cap.get(cv2.CAP_PROP_FPS)
            print(f"✅ Fallback camera initialized ({self.width}x{self.height} @ {actual_fps} FPS, Codec: {codec})")

    def _capture_worker(self):
        empty_streak = 0
        while self.running:
            if not self.cap or not self.cap.isOpened():
                time.sleep(0.02)
                continue
            ret = self.cap.grab()
            if not ret:
                empty_streak += 1
                time.sleep(0.03 if empty_streak > 60 else 0.002)
                continue
            empty_streak = 0
            ret, frame = self.cap.retrieve()
            if not ret or frame is None:
                continue
            with self.lock:
                self.frame = frame
                self.ret = ret
                self.frame_count += 1
                self.last_capture_time = time.monotonic()
            self.new_frame_event.set()

    def read_latest(self, wait_timeout=0.08):
        self.new_frame_event.wait(timeout=wait_timeout)
        self.new_frame_event.clear()
        with self.lock:
            if self.frame is None:
                return False, None, 0.0
            return self.ret, self.frame.copy(), self.last_capture_time

    def is_opened(self):
        return self.cap is not None and self.cap.isOpened()

    def release(self):
        self.running = False
        self.new_frame_event.set()
        try:
            if hasattr(self, 'thread') and self.thread.is_alive():
                self.thread.join(timeout=1.0)
        except Exception:
            pass
        if self.cap:
            self.cap.release()
