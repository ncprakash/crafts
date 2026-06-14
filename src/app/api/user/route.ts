import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from 'zod';
import { generateVerificationToken, sendVerificationEmail } from "@/lib/email";

const UserSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have more than 8 characters'),
  phone_num: z
    .string()
    .length(10, { message: "Phone number must be 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
});

export async function GET(_req: NextRequest) {
  try {
    const users = await db.user.findMany({
      select: { id: true, email: true, username: true, role: true, isVerified: true, phone_num: true }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = UserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input data", error: parsed.error.errors },
        { status: 400 }
      );
    }

    const { email, username, password, phone_num } = parsed.data;

    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ message: "User with this username already exists" }, { status: 409 });
    }

    const existingPhone = await db.user.findFirst({ where: { phone_num } });
    if (existingPhone) {
      return NextResponse.json({ message: "This phone number is already registered" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await db.user.create({
      data: { email, username, password: hashedPassword, phone_num, verificationToken, verificationTokenExpiry },
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      const { password: _p, verificationToken: _t, verificationTokenExpiry: _e, ...rest } = newUser;
      return NextResponse.json(
        { user: rest, message: "User created successfully. Email verification is not configured." },
        { status: 201 }
      );
    }

    const emailSent = await sendVerificationEmail(email, verificationToken);
    if (!emailSent) {
      await db.user.delete({ where: { id: newUser.id } });
      return NextResponse.json({ message: "Failed to send verification email. Please try again." }, { status: 500 });
    }

    const { password: _p, verificationToken: _t, verificationTokenExpiry: _e, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: "User created successfully. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
