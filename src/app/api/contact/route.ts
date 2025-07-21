import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Make sure this is your Prisma client

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }


    await db.contact.create({
      data: { name, email, message }
    });

    return NextResponse.json({ success: true, message: 'Thank you for contacting us!' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}