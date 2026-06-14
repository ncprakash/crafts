// app/api/debug-connection/route.ts
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test the actual database connection
    const result = await db.$queryRaw`SELECT 1 as test`;
    return Response.json({
      success: true,
      message: "Database connection successful",
      result: result
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return Response.json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
}