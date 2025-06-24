// middleware.ts
import { updateSession } from '@/app/utils/supabase/middleware' // adjust if path is different
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Matcher for all routes except static/public/api
export const config = {
  matcher: [
    // protect everything under /app, except login, signup, etc.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|auth|login|signup|api).*)',
  ],
}
