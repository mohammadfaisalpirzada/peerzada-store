import { NextRequest, NextResponse } from 'next/server';
import { createProductFromWhatsAppItem } from '@/lib/whatsappSanityAutomation';
import { validateSession } from '@/lib/admin';

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

function isAuthorized(request: NextRequest): boolean {
  // Check API key / Bearer token
  const authHeader = request.headers.get('authorization');
  const apiKeyHeader = request.headers.get('x-api-key');
  const secretKey =
    process.env.ADMIN_API_KEY ||
    process.env.CRON_SECRET ||
    process.env.WHATSAPP_SYNC_TOKEN ||
    process.env.AUTH_SECRET;

  if (secretKey) {
    if (apiKeyHeader === secretKey || authHeader === `Bearer ${secretKey}`) {
      return true;
    }
  }

  // Check admin session cookie
  const adminToken = request.cookies.get('admin_token')?.value;
  if (adminToken) {
    const session = validateSession(adminToken);
    if (session.valid) return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication or valid API key required.' },
        { status: 401 }
      );
    }

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
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
