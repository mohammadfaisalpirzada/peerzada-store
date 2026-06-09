import { NextRequest, NextResponse } from 'next/server';
import {
  createProductFromWhatsAppItem,
  type WhatsAppImportItem,
} from '@/lib/whatsappSanityAutomation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get('authorization');
  const cronHeader = request.headers.get('x-cron-secret');

  return authHeader === `Bearer ${secret}` || cronHeader === secret;
}

async function fetchPendingWhatsAppItems() {
  const sourceUrl = process.env.WHATSAPP_SYNC_SOURCE_URL;
  const sourceToken = process.env.WHATSAPP_SYNC_SOURCE_TOKEN;

  if (!sourceUrl) {
    throw new Error('Missing WHATSAPP_SYNC_SOURCE_URL environment variable.');
  }

  const response = await fetch(sourceUrl, {
    headers: {
      ...(sourceToken ? { Authorization: `Bearer ${sourceToken}` } : {}),
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch WhatsApp feed (status ${response.status}).`);
  }

  const data = (await response.json()) as WhatsAppImportItem[] | { items?: WhatsAppImportItem[] };
  const items = Array.isArray(data) ? data : data.items || [];

  return items.filter((item) => typeof item?.imageUrl === 'string' && item.imageUrl.trim().length > 0);
}

async function handleSync(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized request.' }, { status: 401 });
  }

  try {
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam || 10), 1), 25);
    const items = await fetchPendingWhatsAppItems();
    const batch = items.slice(0, limit);

    if (batch.length === 0) {
      return NextResponse.json({
        success: true,
        fetched: items.length,
        processed: 0,
        created: 0,
        skipped: 0,
        failed: [],
        message: 'No WhatsApp image items were available for import.',
      });
    }

    const results = await Promise.allSettled(batch.map((item) => createProductFromWhatsAppItem(item)));

    const created = results.filter(
      (result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof createProductFromWhatsAppItem>>> =>
        result.status === 'fulfilled' && !result.value.skipped
    );

    const skipped = results.filter(
      (result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof createProductFromWhatsAppItem>>> =>
        result.status === 'fulfilled' && result.value.skipped
    );

    const failed = results
      .map((result, index) => {
        if (result.status === 'rejected') {
          return {
            index,
            imageUrl: batch[index]?.imageUrl,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
          };
        }

        return null;
      })
      .filter(Boolean);

    return NextResponse.json({
      success: failed.length === 0,
      fetched: items.length,
      processed: batch.length,
      created: created.length,
      skipped: skipped.length,
      failed,
      items: results
        .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof createProductFromWhatsAppItem>>> => result.status === 'fulfilled')
        .map((result) => result.value),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected sync error';

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}
