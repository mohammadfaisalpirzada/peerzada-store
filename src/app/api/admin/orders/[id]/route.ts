import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/admin';
import { updateOrderStatus } from '@/lib/sheets';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
