import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/delivery';

export async function POST(req: NextRequest) {
  try {
    const { email, name, trackingNumber } = await req.json();

    if (!email || !trackingNumber || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50;">📦 Your Order Has Been Shipped!</h2>
        <p style="font-size: 16px; color: #333;">Hi ${name},</p>
        <p style="font-size: 16px; color: #333;">Your order has been shipped successfully.</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p>Track your shipment <a href="https://www.17track.net/en#nums=${trackingNumber}" target="_blank">here</a>.</p>
        <p style="font-size: 14px; color: #666;">Thank you for shopping with us!</p>
      </div>
    `;

    await sendEmail({ to: email, subject: 'Your Order Has Been Shipped!', html });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error sending shipping email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
