import { NextRequest, NextResponse } from 'next/server';
import { storeOTP, isAdminPhone } from '@/lib/admin';

async function sendViaUltraMsg(phone: string, otp: string): Promise<boolean> {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  if (!instanceId || !token) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Dev UltraMsg fallback] OTP for ${phone}: ${otp}`);
    }
    return false;
  }
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const to = cleanPhone.startsWith('92')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? '92' + cleanPhone.slice(1)
    : '92' + cleanPhone;

  try {
    const res = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        to,
        body: `Peerzada Store Admin OTP: ${otp}\n\nThis verification code expires in 5 minutes. Do not share this code with anyone.`,
      }),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    return data.sent === true || data.status === 'success';
  } catch (err) {
    console.error('[UltraMsg] Network error:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';

    if (!phone || !isAdminPhone(phone)) {
      return NextResponse.json({ error: 'Unauthorized phone number' }, { status: 403 });
    }

    // Rate-limiting check: enforce 45s cooldown per client
    const lastRequest = request.cookies.get('admin_otp_cooldown')?.value;
    if (lastRequest) {
      const remainingSeconds = Math.ceil((Number(lastRequest) - Date.now()) / 1000);
      if (remainingSeconds > 0) {
        return NextResponse.json(
          { error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    const { otp, challengeToken } = storeOTP(phone);
    if (!otp) {
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    const sent = await sendViaUltraMsg(phone, otp);

    const response = NextResponse.json({
      success: true,
      phone,
      message: sent ? 'OTP sent via WhatsApp' : 'OTP generated (WhatsApp gateway in dev mode)',
    });

    // Store stateless challenge token in httpOnly cookie
    response.cookies.set('admin_otp_challenge', challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 5 * 60, // 5 minutes
    });

    // Set cooldown cookie for 45 seconds
    response.cookies.set('admin_otp_cooldown', String(Date.now() + 45000), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 45,
    });

    return response;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}
