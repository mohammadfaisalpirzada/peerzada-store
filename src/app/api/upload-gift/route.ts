import { NextRequest, NextResponse } from 'next/server';
import { createProductFromWhatsAppItem } from '@/lib/whatsappSanityAutomation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type UploadGiftPayload = {
  imageUrl?: string;
  description?: string;
  title?: string;
  caption?: string;
  sourceId?: string;
  postedAt?: string;
  groupName?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UploadGiftPayload;

    if (!body.imageUrl?.trim()) {
      return NextResponse.json(
        { success: false, error: 'The `imageUrl` field is required.' },
        { status: 400 }
      );
    }

    const result = await createProductFromWhatsAppItem({
      imageUrl: body.imageUrl,
      description: body.description,
      title: body.title,
      caption: body.caption,
      sourceId: body.sourceId,
      postedAt: body.postedAt,
      groupName: body.groupName,
    });

    return NextResponse.json(
      {
        success: true,
        message: result.skipped
          ? 'This WhatsApp item was already synced to Sanity.'
          : 'Gift uploaded and product created successfully.',
        ...result,
      },
      { status: result.skipped ? 200 : 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
