import queue
import threading
import time
import pyttsx3

class VoiceCoach:
    """
    Zero-lag persistent Text-to-Speech (TTS) worker thread with bounded queue.
    Prevents thread locking and audio buffering backlog.
    """
    def __init__(self, cooldown=2.8):
        self.cooldown = cooldown
        self.last_spoken = 0
        self.speech_queue = queue.Queue(maxsize=1)
        self.worker = threading.Thread(target=self._tts_worker, daemon=True)
        self.worker.start()

    def speak(self, text, force=False):
        now = time.monotonic()
        if not force and (now - self.last_spoken < self.cooldown):
            return
        self.last_spoken = now
        try:
            self.speech_queue.get_nowait()
        except queue.Empty:
            pass
        try:
            self.speech_queue.put_nowait(text)
        except queue.Full:
            pass

    def _tts_worker(self):
        try:
            import pythoncom
            pythoncom.CoInitialize()
        except Exception:
            pass

        engine = None
        try:
            engine = pyttsx3.init()
            engine.setProperty('rate', 180)
        except Exception:
            pass

        while True:
            try:
                text = self.speech_queue.get()
                if engine and text:
                    engine.say(text)
                    engine.runAndWait()
            except Exception:
                pass
