import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user session. Please sign in again.' }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const userExists = await db.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: 'User account not found. Please sign in again.' }, { status: 404 });
    }

    let cartOrder = await db.order.findFirst({ where: { userId, status: 'cart' } });

    if (!cartOrder) {
      cartOrder = await db.order.create({
        data: {
          userId,
          customerName: session.user.name || session.user.username || 'Unknown',
          customerEmail: session.user.email || '',
          shippingAddress: '',
          total: 0,
          status: 'cart',
          paymentStatus: 'pending',
        },
      });
    }

    const existingOrderItem = await db.orderItem.findFirst({
      where: { orderId: cartOrder.id, productId },
    });

    if (existingOrderItem) {
      await db.orderItem.update({
        where: { id: existingOrderItem.id },
        data: { quantity: existingOrderItem.quantity + quantity, price: product.price },
      });
    } else {
      await db.orderItem.create({
        data: { orderId: cartOrder.id, productId, quantity, price: product.price },
      });
    }

    const orderItems = await db.orderItem.findMany({
      where: { orderId: cartOrder.id },
      include: { product: true },
    });

    const total = orderItems.reduce((sum, item) => sum + item.price.toNumber() * item.quantity, 0);
    await db.order.update({ where: { id: cartOrder.id }, data: { total } });

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully',
      cartItem: { productId, quantity, price: product.price.toNumber(), name: product.name },
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
