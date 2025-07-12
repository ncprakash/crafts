import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'prekshanimbagal7@gmail.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        user: {
          email: existingAdmin.email,
          username: existingAdmin.username,
          role: existingAdmin.role
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'gunnal123456', 12);

    // Create admin user
    const adminUser = await db.user.create({
      data: {
        email: 'prekshanimbagal7@gmail.com',
        username: 'admin',
        password: hashedPassword,
        phone_num: '+1234567890',
        isVerified: true,
        role: 'admin'
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 