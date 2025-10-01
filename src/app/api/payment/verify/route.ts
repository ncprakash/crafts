import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendPaymentSuccessEmail } from '@/lib/confirm'; // <-- import email function

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Find the order in database
    const order = await db.order.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId: parseInt(session.user.id)
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order with payment details
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        paymentId: razorpay_payment_id,
        paymentStatus: 'paid',
        status: 'confirmed'
      },
      include: { user: true } // include user to get email
    });

    // ✅ Send payment success email
    if (updatedOrder.user?.email) {
      await sendPaymentSuccessEmail(
        updatedOrder.user.email,
        updatedOrder.customerName,
        updatedOrder.id,
        updatedOrder.total
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
