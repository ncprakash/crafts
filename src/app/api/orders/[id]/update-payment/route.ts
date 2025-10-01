import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { paymentStatus, paymentId, razorpayOrderId } = body;

    const order = await db.order.update({
      where: { id },
      data: {
        paymentStatus,
        paymentId,
        razorpayOrderId
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
} 
export async function GET() {
  try {
    const results = await prisma.$queryRawUnsafe(`
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
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}