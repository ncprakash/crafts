import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple middleware that just passes through for now
  // We'll implement proper auth checks later
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/cart/:path*',
    '/order/:path*',
    '/sign-in',
    '/sign-up'
  ],
}; 