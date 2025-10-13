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

    // Debug the request data
    console.log('Request body:', body);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);
    
    // Debug the user ID
    console.log('User ID:', session.user.id);
    console.log('User ID type:', typeof session.user.id);
    console.log('Session user:', session.user);

    // Test database connection first
    console.log('Testing database connection...');
    try {
      await db.$connect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw new Error('Database connection failed');
    }

    // Get the product details
    console.log('Fetching product with ID:', productId);
    const product = await db.product.findUnique({
      where: { id: productId }
    });
    console.log('Product found:', product ? 'Yes' : 'No');

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

    // Parse user ID (should now always be a valid integer string from our auth fix)
    const userId = parseInt(session.user.id);
    
    if (isNaN(userId)) {
      console.error('Invalid user ID in session:', session.user.id);
      return NextResponse.json(
        { error: 'Invalid user session. Please sign in again.' },
        { status: 401 }
      );
    }

    console.log('Final User ID:', userId);

    // Verify user exists in database before proceeding
    const userExists = await db.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      console.error('User not found in database:', userId);
      return NextResponse.json(
        { error: 'User account not found. Please sign in again.' },
        { status: 404 }
      );
    }

    console.log('User verified:', userExists.email);

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return more detailed error information for debugging
    return NextResponse.json(
      { 
        error: 'Failed to add item to cart',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}