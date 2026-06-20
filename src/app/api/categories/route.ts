import { NextResponse } from 'next/server';
import { getCategories } from '@/app/explore/getCategories';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories ?? []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array so UI doesn't break
  }
}
