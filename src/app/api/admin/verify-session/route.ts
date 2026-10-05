import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { validateSession, destroySession } from '@/lib/admin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    const result = validateSession(token);
    if (!result.valid) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (token) {
      destroySession(token);
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
