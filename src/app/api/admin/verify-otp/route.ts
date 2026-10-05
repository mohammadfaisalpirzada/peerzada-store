import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, createSession, isAdminPhone } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'Valid 6-digit OTP is required' }, { status: 400 });
    }
    if (!phone || !isAdminPhone(phone)) {
      return NextResponse.json({ error: 'Unauthorized phone number' }, { status: 403 });
    }

    const challengeToken = request.cookies.get('admin_otp_challenge')?.value;

    if (!verifyOTP(phone, otp, challengeToken)) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 401 });
    }

    const token = createSession(phone);
    const response = NextResponse.json({ success: true, token });

    // Set secure admin session cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Clear the OTP challenge cookie upon success
    response.cookies.set('admin_otp_challenge', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
