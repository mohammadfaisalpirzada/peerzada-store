import { NextRequest, NextResponse } from 'next/server';
import { getNewArrivals } from '@/app/explore/getCategories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get('limit') || '8', 10);
  try {
    const newArrivals = await getNewArrivals(limit);
    return NextResponse.json(newArrivals ?? [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array so UI doesn't break
  }
}
