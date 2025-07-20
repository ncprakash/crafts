export async function GET() {
  return Response.json({
    hasDatabaseURL: !!process.env.DATABASE_URL,
    databaseUrlExists: process.env.DATABASE_URL ? 'YES' : 'NO',
    nodeEnv: process.env.NODE_ENV
    // Don't log actual URL for security
  });
}