import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    await db.$connect();
    
    // Test a simple query
    const userCount = await db.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error.message
    }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
} 