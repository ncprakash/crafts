import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(req: NextRequest, context: Context) {
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