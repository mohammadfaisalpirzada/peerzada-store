import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { insertOrder, getOrdersByEmail } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Please sign in to place an order.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { items, totalAmount, phone, address, transactionId, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const cleanAddress = typeof address === 'string' ? address.trim() : '';

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Please provide a valid contact phone number.' }, { status: 400 });
    }
    if (!cleanAddress || cleanAddress.length < 10) {
      return NextResponse.json({ error: 'Please provide a complete delivery address (min 10 characters).' }, { status: 400 });
    }

    // Validate each cart item and compute verified total server-side
    let calculatedTotal = 0;
    const sanitizedItems: Array<{
      productId: string;
      title: string;
      price: number;
      quantity: number;
      image: string;
      customDetails: string;
    }> = [];

    for (const item of items) {
      if (!item || typeof item !== 'object') {
        return NextResponse.json({ error: 'Invalid order item data.' }, { status: 400 });
      }

      const price = Number(item.price);
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: 'Invalid item price detected.' }, { status: 400 });
      }

      calculatedTotal += price * quantity;

      sanitizedItems.push({
        productId: String(item.productId || '').slice(0, 100),
        title: String(item.title || 'Untitled Item').slice(0, 200),
        price,
        quantity,
        image: typeof item.image === 'string' ? item.image.slice(0, 1000) : '',
        customDetails: typeof item.customDetails === 'string' ? item.customDetails.slice(0, 500) : '',
      });
    }

    // Guard against client-side price manipulation
    const clientTotal = Number(totalAmount);
    if (!isNaN(clientTotal) && Math.abs(clientTotal - calculatedTotal) > 2) {
      console.warn(`[Security Alert] Order total mismatch for ${session.user.email}: client sent ${clientTotal}, server computed ${calculatedTotal}`);
    }

    const verifiedTotal = calculatedTotal;

    const order = await insertOrder({
      userEmail: session.user.email,
      customerName: session.user.name || 'Customer',
      items: sanitizedItems,
      totalAmount: verifiedTotal,
      phone: cleanPhone,
      address: notes ? `${cleanAddress} (Notes: ${String(notes).slice(0, 300)})` : cleanAddress,
      transactionId: typeof transactionId === 'string' ? transactionId.trim().slice(0, 100) : '',
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Something went wrong while placing your order. Please try again.' }, { status: 500 });
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
