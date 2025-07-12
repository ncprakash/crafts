import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// PUT - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (quantity <= 0) {
      // Delete the item if quantity is 0 or less
      await db.orderItem.delete({
        where: { id: params.id }
      });
    } else {
      // Update quantity
      await db.orderItem.update({
        where: { id: params.id },
        data: { quantity }
      });
    }

    // Update order total
    const orderItem = await db.orderItem.findUnique({
      where: { id: params.id },
      include: { order: true }
    });

    if (orderItem) {
      const orderItems = await db.orderItem.findMany({
        where: { orderId: orderItem.orderId }
      });

      const total = orderItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

      await db.order.update({
        where: { id: orderItem.orderId },
        data: { total }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get order item to find the order
    const orderItem = await db.orderItem.findUnique({
      where: { id: params.id },
      include: { order: true }
    });

    if (!orderItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete the order item
    await db.orderItem.delete({
      where: { id: params.id }
    });

    // Update order total
    const remainingItems = await db.orderItem.findMany({
      where: { orderId: orderItem.orderId }
    });

    const total = remainingItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    await db.order.update({
      where: { id: orderItem.orderId },
      data: { total }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
} 