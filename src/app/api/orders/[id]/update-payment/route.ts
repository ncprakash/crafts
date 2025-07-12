import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, razorpayOrderId, paymentStatus = 'paid' } = body;

    // Update the order with payment information
    const updatedOrder = await db.order.update({
      where: {
        id: params.id,
        userId: parseInt(session.user.id), // Ensure user owns this order
      },
      data: {
        paymentStatus,
        paymentId: paymentId || null,
        razorpayOrderId: razorpayOrderId || null,
        status: paymentStatus === 'paid' ? 'processing' : 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    console.error('Error updating order payment:', error);
    return NextResponse.json(
      { error: 'Failed to update order payment' },
      { status: 500 }
    );
  }
} 