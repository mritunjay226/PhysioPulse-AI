import http.server
import json
import socket
import threading
import time
from . import state

class VideoStreamHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, format, *args):
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        self.send_header('Connection', 'keep-alive')
        self.send_header('Keep-Alive', 'timeout=5, max=1000')
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/video_feed'):
            try:
                self.connection.settimeout(2.0)
                self.connection.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                self.connection.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 32768)
            except Exception:
                pass

            my_token = time.time()
            with state.stream_lock:
                state.active_stream_token = my_token
                state.active_stream_clients += 1

            try:
                self.send_response(200)
                self.send_header('Age', '0')
                self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-age=0')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'close')
                self.end_headers()

                last_sent_id = -1
                while state.is_streaming:
                    frame_bytes = None
                    with state.stream_lock:
                        if state.active_stream_token != my_token or not state.is_streaming:
                            break
                        while (state.latest_frame_id == last_sent_id and
                               state.is_streaming and
                               state.active_stream_token == my_token):
                            state.new_frame_condition.wait(timeout=0.04)
                        if state.active_stream_token != my_token or not state.is_streaming:
                            break
                        frame_bytes = state.latest_jpeg_frame
                        last_sent_id = state.latest_frame_id

                    if frame_bytes is not None:
                        try:
                            header = f"--frame\r\nContent-Type: image/jpeg\r\nContent-Length: {len(frame_bytes)}\r\n\r\n".encode('ascii')
                            self.wfile.write(header)
                            self.wfile.write(frame_bytes)
                            self.wfile.write(b'\r\n')
                            self.wfile.flush()
                        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, TimeoutError, OSError):
                            break
                        except Exception:
                            break
            finally:
                with state.stream_lock:
                    state.active_stream_clients = max(0, state.active_stream_clients - 1)

        elif self.path.startswith('/snapshot') or self.path.startswith('/frame.jpg'):
            with state.stream_lock:
                state.last_snapshot_time = time.monotonic()
                frame_bytes = state.latest_jpeg_frame
            if frame_bytes:
                self.send_response(200)
                self.send_header('Content-Type', 'image/jpeg')
                self.send_header('Content-Length', str(len(frame_bytes)))
                self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-age=0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'keep-alive')
                self.send_header('Keep-Alive', 'timeout=5, max=1000')
                self.end_headers()
                try:
                    self.wfile.write(frame_bytes)
                except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, TimeoutError, OSError):
                    pass
                except Exception:
                    pass
            else:
                self.send_response(503)
                self.send_header('Content-Length', '0')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Connection', 'keep-alive')
                self.end_headers()

        elif self.path.startswith('/status'):
            telemetry_data = state.get_telemetry()
            status_json = json.dumps(telemetry_data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(status_json)))
            self.send_header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-age=0')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(status_json)
            except Exception:
                pass

        elif self.path.startswith('/skip'):
            state.set_external_action('skip')
            resp = b'{"status":"skipping"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(resp)
            except Exception:
                pass

        elif self.path.startswith('/toggle_skeleton'):
            is_shown = state.toggle_skeleton()
            resp = json.dumps({"status": "ok", "show_skeleton": is_shown}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(resp)
            except Exception:
                pass

        elif self.path.startswith('/quit'):
            state.set_external_action('quit')
            resp = b'{"status":"quitting"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Keep-Alive', 'timeout=5, max=1000')
            self.end_headers()
            try:
                self.wfile.write(resp)
            except Exception:
                pass

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path.startswith('/toggle_skeleton'):
            is_shown = state.toggle_skeleton()
            resp = json.dumps({"status": "ok", "show_skeleton": is_shown}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(resp)
        elif self.path.startswith('/skip'):
            state.set_external_action('skip')
            resp = b'{"status":"skipping"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(resp)
        elif self.path.startswith('/quit'):
            state.set_external_action('quit')
            resp = b'{"status":"quitting"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(resp)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(resp)
        else:
            self.send_response(404)
            self.end_headers()


def start_embedded_server(port: int = 8000):
    """Starts the HTTP and MJPEG streaming server on a dedicated background thread."""
    try:
        server = http.server.ThreadingHTTPServer(('0.0.0.0', port), VideoStreamHandler)
        server_thread = threading.Thread(target=server.serve_forever, daemon=True)
        server_thread.start()
        print(f"📡 Embedded Vision Streamer active on http://127.0.0.1:{port}/video_feed")
        return server
    except Exception as e:
        print(f"⚠️ Warning: Could not bind streaming server to port {port}: {e}")
        return None


# Export handler for Vercel Python serverless runtime
handler = VideoStreamHandler
