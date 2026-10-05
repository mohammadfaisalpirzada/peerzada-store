import { NextRequest, NextResponse } from 'next/server';
import { createProductFromWhatsAppItem } from '@/lib/whatsappSanityAutomation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BaileysWebhookBody = {
  payload?: {
    url?: string;
    caption?: string;
    id?: string;
    timestamp?: string;
  };
};

function isAuthorized(request: NextRequest): boolean {
  const secret =
    process.env.BAILEYS_WEBHOOK_SECRET ||
    process.env.WEBHOOK_SECRET ||
    process.env.CRON_SECRET;

  if (secret) {
    const authHeader = request.headers.get('authorization');
    const webhookHeader = request.headers.get('x-webhook-secret');
    const querySecret = request.nextUrl.searchParams.get('secret');

    return (
      authHeader === `Bearer ${secret}` ||
      webhookHeader === secret ||
      querySecret === secret
    );
  }

  // In production, require secret configuration
  return process.env.NODE_ENV !== 'production';
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized webhook request.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as BaileysWebhookBody;
    const imageUrl = body?.payload?.url?.trim();
    const caption = body?.payload?.caption?.trim() || '';

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing `payload.url` in Baileys webhook body.' },
        { status: 400 }
      );
    }

    const result = await createProductFromWhatsAppItem({
      imageUrl,
      caption,
      description: caption,
      title: caption || 'WhatsApp Product',
      sourceId: body?.payload?.id,
      postedAt: body?.payload?.timestamp,
      groupName: 'Baileys WhatsApp',
    });

    return NextResponse.json(
      {
        success: true,
        message: result.skipped
          ? 'Baileys webhook item was already synced.'
          : 'Baileys webhook item uploaded to Sanity successfully.',
        ...result,
      },
      { status: result.skipped ? 200 : 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected webhook error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
