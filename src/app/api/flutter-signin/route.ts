// app/api/auth/flutter-signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before signing in" },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign in with NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Return success with user data
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Sign in successful",
        user: {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        },
        // Optional: Include session token if needed
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Flutter Sign-in Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
