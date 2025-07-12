import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

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

    // Get or create user's cart order
    let cartOrder = await db.order.findFirst({
      where: {
        userId: parseInt(session.user.id),
        status: 'cart' // We'll use 'cart' status for items in cart
      }
    });

    if (!cartOrder) {
      // Create new cart order
      cartOrder = await db.order.create({
        data: {
          userId: parseInt(session.user.id),
          customerName: session.user.username || 'Unknown',
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
          price: Number(product.price)
        }
      });
    } else {
      // Create new order item
      await db.orderItem.create({
        data: {
          orderId: cartOrder.id,
          productId: productId,
          quantity: quantity,
          price: Number(product.price)
        }
      });
    }

    // Update order total
    const orderItems = await db.orderItem.findMany({
      where: { orderId: cartOrder.id }
    });

    const total = orderItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

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
        price: Number(product.price),
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