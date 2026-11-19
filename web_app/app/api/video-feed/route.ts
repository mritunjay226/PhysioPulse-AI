export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isSnapshot = searchParams.get('snapshot') === '1' || searchParams.get('snapshot') === 'true';
    const appBaseUrl = (process.env.APP_URL || 'http://127.0.0.1:8000').replace(/\/?$/, '/');
    const endpoint = isSnapshot ? 'frame.jpg' : 'video_feed';
    const upstreamUrl = new URL(endpoint, appBaseUrl);

    const upstreamRes = await fetch(upstreamUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1200)
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return new Response(null, { status: 204 });
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
  } catch {
    // Return 204 No Content for offline vision daemon so browser console doesn't display red 503 errors
    return new Response(null, { status: 204 });
  }
}
