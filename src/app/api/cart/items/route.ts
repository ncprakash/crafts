import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's cart order
    const cartOrder = await db.order.findFirst({
      where: {
        userId: parseInt(session.user.id),
        status: 'cart'
      }
    });

    if (!cartOrder) {
      return NextResponse.json({
        items: [],
        total: 0,
        itemCount: 0
      });
    }

    // Get cart items with product details
    const cartItems = await db.orderItem.findMany({
      where: {
        orderId: cartOrder.id
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            stock: true
          }
        }
      }
    });

    const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      items: cartItems,
      total,
      itemCount
    });

  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find and delete the user's cart order
    const cartOrder = await db.order.findFirst({
      where: {
        userId: parseInt(session.user.id),
        status: 'cart'
      }
    });

    if (cartOrder) {
      // Delete all cart items
      await db.orderItem.deleteMany({
        where: {
          orderId: cartOrder.id
        }
      });

      // Delete the cart order
      await db.order.delete({
        where: {
          id: cartOrder.id
        }
      });

      console.log('Server-side cart cleared for user:', session.user.id);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
} 