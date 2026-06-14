import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {db } from '@/lib/db';
import Razorpay from 'razorpay';




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

    // Create Razorpay order
    try {
      const razorPay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      
      const razorpayOrder = await razorPay.orders.create({
        amount: total * 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          zip,
          state,
          country,
        },
      });

      // Parse user ID (should now always be a valid integer string from our auth fix)
      const userId = parseInt(session.user.id);
      
      if (isNaN(userId)) {
        console.error('Invalid user ID in session:', session.user.id);
        return NextResponse.json(
          { error: 'Invalid user session. Please sign in again.' },
          { status: 401 }
        );
      }

      // Create the order in database
      const order = await db.order.create({
        data: {
          userId: userId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: `${shippingAddress}, ${city}, ${state} ${zip}, ${country}`,
          total: total,
          status: 'pending',
          paymentStatus: 'pending',
          razorpayOrderId: razorpayOrder.id,
        }
      });

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map((item: { productId: string; quantity: number; price: number }) =>
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
        razorpayOrder,
        order: {
          ...order,
          items: orderItems
        }
      });

    } catch (razorpayError) {
      console.error('Razorpay error:', razorpayError);
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}


export async function GET(req:Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }
    const results = await db.$queryRawUnsafe(`
      SELECT 
        o.id AS "orderId",
        o."customerName",
        o."customerEmail",
        o."customerPhone",
        o."shippingAddress",
        o.total,
        o.status,
        o."paymentStatus",
        o."trackingNumber",
        o."paymentId",
        o."razorpayOrderId",
        o."orderDate",
        o."updatedAt",
        u.id AS "userId",
        u.username AS "username",
        u.email AS "userEmail",
        oi.id AS "orderItemId",
        oi.quantity,
        oi.price AS "itemPrice",
        p.id AS "productId",
        p.name AS "productName",
        p.price AS "productPrice",
        p.discount,
        p.images,
        p.description,
        p.slug
      FROM "Order" o
      JOIN "User" u ON o."userId" = u.id
      JOIN "OrderItem" oi ON oi."orderId" = o.id
      JOIN "Product" p ON oi."productId" = p.id
      ORDER BY o."orderDate" DESC
    `);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
