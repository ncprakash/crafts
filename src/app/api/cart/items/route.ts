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

    // Parse user ID (should now always be a valid integer string from our auth fix)
    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      console.error('Invalid user ID in session:', session.user.id);
      return NextResponse.json(
        { error: 'Invalid user session. Please sign in again.' },
        { status: 401 }
      );
    }

    // Get user's cart order
    const cartOrder = await db.order.findFirst({
      where: {
        userId: userId,
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

    // Get cart items with product details including category
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
            cloudinaryImages: true, // Add cloudinaryImages field
            stock: true,
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Safely convert Decimal to number
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price.toNumber() * item.quantity);
    }, 0);

    const itemCount = cartItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    // Debug logging
    console.log('🛒 Cart items fetched:', cartItems.map(item => ({
      id: item.id,
      productName: item.product?.name,
      categoryName: item.product?.category?.name,
      quantity: item.quantity
    })));

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

    // Parse user ID (should now always be a valid integer string from our auth fix)
    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      console.error('Invalid user ID in session:', session.user.id);
      return NextResponse.json(
        { error: 'Invalid user session. Please sign in again.' },
        { status: 401 }
      );
    }

    // 🚨 CRITICAL FIX: Instead of deleting OrderItems (which contain uploaded images),
    // we should update the order status to 'completed' to preserve the data
    console.log('🛒 Clearing cart for user:', userId);
    
    // Update all cart orders to 'completed' status instead of deleting
    const updatedOrders = await db.order.updateMany({
      where: {
        userId: userId,
        status: 'cart'
      },
      data: {
        status: 'completed'
      }
    });

    console.log('✅ Updated orders status to completed:', updatedOrders.count);

    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared successfully',
      updatedOrders: updatedOrders.count
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
