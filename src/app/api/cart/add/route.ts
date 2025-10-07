import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log('Session:', session); // Debug log

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    // Debug the user ID
    console.log('User ID:', session.user.id);
    console.log('User ID type:', typeof session.user.id);

    // Get the product details
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is in stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // FIX: Handle different ID types (string vs number)
    let userId: number;
    
    if (typeof session.user.id === 'string') {
      // Try to parse as integer, but have a fallback
      const parsedId = parseInt(session.user.id);
      if (isNaN(parsedId)) {
        // If it's a string that can't be parsed (like from Google OAuth),
        // we need to find the user by email instead
        const user = await db.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (!user) {
          return NextResponse.json(
            { error: 'User account not found. Please complete your profile.' },
            { status: 404 }
          );
        }
        
        userId = user.id;
      } else {
        userId = parsedId;
      }
    } else {
      userId = session.user.id;
    }

    console.log('Final User ID:', userId);

    // Get or create user's cart order
    let cartOrder = await db.order.findFirst({
      where: {
        userId: userId,
        status: 'cart'
      }
    });

    if (!cartOrder) {
      // Create new cart order
      cartOrder = await db.order.create({
        data: {
          userId: userId,
          customerName: session.user.name || session.user.username || 'Unknown',
          customerEmail: session.user.email || '',
          shippingAddress: '',
          total: 0,
          status: 'cart',
          paymentStatus: 'pending'
        }
      });
    }

    // Check if item already exists in cart
    const existingOrderItem = await db.orderItem.findFirst({
      where: {
        orderId: cartOrder.id,
        productId: productId
      }
    });

    if (existingOrderItem) {
      // Update quantity
      await db.orderItem.update({
        where: { id: existingOrderItem.id },
        data: {
          quantity: existingOrderItem.quantity + quantity,
          price: product.price
        }
      });
    } else {
      // Create new order item
      await db.orderItem.create({
        data: {
          orderId: cartOrder.id,
          productId: productId,
          quantity: quantity,
          price: product.price
        }
      });
    }

    // Update order total
    const orderItems = await db.orderItem.findMany({
      where: { orderId: cartOrder.id },
      include: {
        product: true
      }
    });

    const total = orderItems.reduce((sum, item) => {
      return sum + (item.price.toNumber() * item.quantity);
    }, 0);

    await db.order.update({
      where: { id: cartOrder.id },
      data: { total }
    });

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully',
      cartItem: {
        productId,
        quantity,
        price: product.price.toNumber(),
        name: product.name
      }
    });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}