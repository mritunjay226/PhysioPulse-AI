export const maxDuration = 300;

export async function GET() {
  try {
    const pythonStreamUrl = 'http://127.0.0.1:8000/video_feed';
    const upstreamRes = await fetch(pythonStreamUrl, {
      cache: 'no-store'
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return new Response('Vision engine feed not ready', { status: 503 });
    }

    return new Response(upstreamRes.body, {
      headers: {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
        'Cache-Control': 'no-cache, private, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0'
      }
    });
  } catch (err: any) {
    return new Response('Vision stream offline', { status: 503 });
  }
}
