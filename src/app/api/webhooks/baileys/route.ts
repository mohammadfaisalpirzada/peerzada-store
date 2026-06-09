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

export async function POST(request: NextRequest) {
  try {
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
