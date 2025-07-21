import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Here you can add logic to send an email or store the message in a database
    // For now, just return a success response
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json({ success: true, message: 'Thank you for contacting us!' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
