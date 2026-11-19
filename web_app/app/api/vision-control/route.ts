import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawAction = searchParams.get('action') || 'status';
  const action = rawAction.replace(/^\//, '');

  try {
    const appBaseUrl = (process.env.APP_URL || 'http://127.0.0.1:8000').replace(/\/?$/, '/');
    const targetUrl = new URL(action, appBaseUrl);
    const res = await fetch(targetUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(800)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, error: 'Upstream stream responded with error' },
      { status: res.status }
    );
  } catch {
    // Cloud / Vercel fallback: return 200 with cloud indicator instead of 503 error in console
    return NextResponse.json({
      success: true,
      cloud: true,
      offline: true,
      message: 'Cloud Vision active (local python daemon not reachable)',
      data: null
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawAction = body.action || 'status';
    const action = rawAction.replace(/^\//, '');
    const appBaseUrl = (process.env.APP_URL || 'http://127.0.0.1:8000').replace(/\/?$/, '/');
    const targetUrl = new URL(action, appBaseUrl);

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(800)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, error: 'Upstream responded with error' },
      { status: res.status }
    );
  } catch {
    return NextResponse.json({
      success: true,
      cloud: true,
      offline: true,
      message: 'Cloud Vision control acknowledged'
    });
  }
}
