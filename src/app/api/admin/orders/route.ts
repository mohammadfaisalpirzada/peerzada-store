import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/admin';
import { getAllOrders } from '@/lib/sheets';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const session = validateSession(token);
    if (!session.valid) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
