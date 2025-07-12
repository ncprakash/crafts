import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      zip,
      state,
      country,
      cartItems,
      total
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !shippingAddress || !cartItems || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the order
    const order = await db.order.create({
      data: {
        userId: parseInt(session.user.id),
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: `${shippingAddress}, ${city}, ${state} ${zip}, ${country}`,
        total: total,
        status: 'pending',
        paymentStatus: 'pending',
      }
    });

    // Create order items
    const orderItems = await Promise.all(
      cartItems.map((item: any) =>
        db.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: {
        userId: parseInt(session.user.id)
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        orderDate: 'desc'
      }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 