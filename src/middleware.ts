import { createClient } from '@/src/app/utils/supabase/server';
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: { session } } = await supabase.auth.getSession()
  // console.log('SESSION:', session)
  const pathname = request.nextUrl.pathname

  // Allow these public paths without auth
  const publicPaths = ['/', '/signin', '/signup', '/api']

  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') || // allow next.js internals
    pathname.includes('.') // allow static files like .js, .css, images, fonts etc
  ) {
    return supabaseResponse
  }

  if (!user) {
    // Redirect to signin if no user and trying to access protected route
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}