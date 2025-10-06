import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    // Fetch orders for the given email
    const results = await db.$queryRaw`
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
      JOIN "OrderItem" oi ON oi."orderId" = o.id
      JOIN "Product" p ON oi."productId" = p.id
      WHERE o."customerEmail" = ${email}
      ORDER BY o."orderDate" DESC
    `;

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
