import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/app/products/getProducts';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchProducts(q);
    return NextResponse.json(results ?? []);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json([], { status: 200 });
  }
}
