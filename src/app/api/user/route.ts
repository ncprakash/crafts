import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from 'zod';
import { generateVerificationToken, sendVerificationEmail } from "@/lib/email";

const UserSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have more than 8 characters'),
    phone_num: z
      .string()
      .length(10, { message: "Phone number must be 10 digits" })
      .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  });

export async function POST(req: NextRequest) {
  try {
    // Check if database is connected
    try {
      await db.$connect();
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { message: "Database connection failed", error: dbError.message },
        { status: 500 }
      );
    }

    const body = await req.json();
    
    // Validate input schema
    let validatedData;
    try {
      validatedData = UserSchema.parse(body);
    } catch (validationError: any) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { message: "Invalid input data", error: validationError.errors },
        { status: 400 }
      );
    }

    const { email, username, password, phone_num } = validatedData;

    // Check for existing user by email
    try {
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      }
    } catch (error: any) {
      console.error("Email check error:", error);
      return NextResponse.json(
        { message: "Error checking email", error: error.message },
        { status: 500 }
      );
    }

    // Check for existing user by username
    try {
      const existingUsername = await db.user.findUnique({ where: { username } });
      if (existingUsername) {
        return NextResponse.json(
          { message: "User with this username already exists" },
          { status: 409 }
        );
      }
    } catch (error: any) {
      console.error("Username check error:", error);
      return NextResponse.json(
        { message: "Error checking username", error: error.message },
        { status: 500 }
      );
    }

    // Check for existing user by phone number
    try {
      const existingPhone = await db.user.findFirst({ where: { phone_num } });
      if (existingPhone) {
        return NextResponse.json(
          { message: "This phone number is already registered" },
          { status: 409 }
        );
      }
    } catch (error: any) {
      console.error("Phone check error:", error);
      return NextResponse.json(
        { message: "Error checking phone number", error: error.message },
        { status: 500 }
      );
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await hash(password, 10);
    } catch (hashError: any) {
      console.error("Password hashing error:", hashError);
      return NextResponse.json(
        { message: "Error processing password", error: hashError.message },
        { status: 500 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    let newUser;
    try {
      newUser = await db.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          phone_num,
          verificationToken,
          verificationTokenExpiry,
        },
      });
    } catch (createError: any) {
      console.error("User creation error:", createError);
      return NextResponse.json(
        { message: "Error creating user", error: createError.message },
        { status: 500 }
      );
    }

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email configuration missing - skipping email verification");
      // Don't delete the user, just return success without email
      const { password: newUserPassword, verificationToken: _, verificationTokenExpiry: __, ...rest } = newUser;
      return NextResponse.json(
        { 
          user: rest, 
          message: "User created successfully. Email verification is not configured.",
          warning: "Please configure email settings for verification emails"
        },
        { status: 201 }
      );
    }

    // Send verification email
    try {
      const emailSent = await sendVerificationEmail(email, verificationToken);
      
      if (!emailSent) {
        // If email fails, delete the user and return error
        await db.user.delete({ where: { id: newUser.id } });
        return NextResponse.json(
          { message: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }
    } catch (emailError: any) {
      console.error("Email sending error:", emailError);
      // Delete the user if email fails
      await db.user.delete({ where: { id: newUser.id } });
      return NextResponse.json(
        { message: "Failed to send verification email", error: emailError.message },
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
  } finally {
    try {
      await db.$disconnect();
    } catch (disconnectError) {
      console.error("Database disconnect error:", disconnectError);
    }
  }
}
