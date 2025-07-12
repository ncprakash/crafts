import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    console.log('Testing database connection...');
    
    // Check if admin user exists
    const adminUser = await db.user.findUnique({
      where: { email: 'prekshanimbagal7@gmail.com' }
    });

    if (!adminUser) {
      return NextResponse.json({
        status: 'error',
        message: 'Admin user not found',
        suggestion: 'Visit /setup-admin to create admin user'
      });
    }

    // Test password validation
    const testPassword = 'gunnal123456';
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);

    return NextResponse.json({
      status: 'success',
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role,
        isVerified: adminUser.isVerified,
        isActive: adminUser.isActive
      },
      passwordTest: {
        providedPassword: testPassword,
        isValid: isPasswordValid,
        hashedPasswordLength: adminUser.password.length
      },
      databaseStatus: 'connected'
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 