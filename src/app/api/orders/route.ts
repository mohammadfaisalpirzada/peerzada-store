import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { insertOrder, getOrdersByEmail } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in to place an order.' }, { status: 401 });
    }

    const { items, totalAmount, phone, address } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!phone || !address) {
      return NextResponse.json({ error: 'Phone and address are required.' }, { status: 400 });
    }

    const order = await insertOrder({
      userEmail: session.user.email,
      customerName: session.user.name || 'Customer',
      items: items.map((i: any) => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount,
      phone,
      address,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
    }

    const orders = await getOrdersByEmail(session.user.email);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
