import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'status';

  try {
    const targetUrl = `http://127.0.0.1:8000/${action}`;
    const res = await fetch(targetUrl, {
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, error: 'Upstream stream responded with error' },
      { status: res.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Vision engine not actively streaming', details: err.message },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'status';
    const targetUrl = `http://127.0.0.1:8000/${action}`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, error: 'Upstream responded with error' },
      { status: res.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Vision engine not actively streaming', details: err.message },
      { status: 503 }
    );
  }
}
