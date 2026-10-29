export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isSnapshot = searchParams.get('snapshot') === '1' || searchParams.get('snapshot') === 'true';
    const pythonStreamUrl = isSnapshot ? 'http://127.0.0.1:8000/frame.jpg' : 'http://127.0.0.1:8000/video_feed';

    const upstreamRes = await fetch(pythonStreamUrl, {
      cache: 'no-store'
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return new Response('Vision engine feed not ready', { status: 503 });
    }

    if (isSnapshot) {
      const buffer = await upstreamRes.arrayBuffer();
      return new Response(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-age=0'
        }
      });
    }

    return new Response(upstreamRes.body, {
      headers: {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0'
      }
    });
  } catch (err: any) {
    return new Response('Vision stream offline', { status: 503 });
  }
}
