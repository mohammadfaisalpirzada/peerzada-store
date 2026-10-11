import { NextResponse } from 'next/server';
import { getCategories } from '@/app/explore/getCategories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories ?? [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array so UI doesn't break
  }
}
