import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from 'zod';
import { generateVerificationToken, sendVerificationEmail } from "@/lib/email";
const UserSchma = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
   
   phone_num: z
    .string()
    .length(10, { message: "Phone number must be 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  })



export async function POST(req: NextRequest) {

  
  try {
    const body = await req.json();
    const { email, username, password, phone_num } = UserSchma.parse(body);

    // Validate inputs
    if (!email || !username || !password || !phone_num) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check for existing user by email
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check for existing user by username
    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { message: "User with this username already exists" },
        { status: 409 }
      );
    }

    // ✅ Use findFirst instead of findUnique for phone_num
    const existingPhone = await db.user.findFirst({ where: { phone_num } });
    if (existingPhone) {
      return NextResponse.json(
        { message: "This phone number is already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        phone_num,
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);
    
    if (!emailSent) {
      // If email fails, delete the user and return error
      await db.user.delete({ where: { id: newUser.id } });
      return NextResponse.json(
        { message: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    const { password: newUserPassword, verificationToken: _, verificationTokenExpiry: __, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: "User created successfully. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || error },
      { status: 500 }
    );
  }
}
