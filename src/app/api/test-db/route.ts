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
  } catch (error: any) {
    return Response.json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      code: error.code,
      details: {
        name: error.name,
        stack: error.stack?.split('\n')[0] // First line only for security
      }
    });
  }
}