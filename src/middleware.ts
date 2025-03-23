import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/session'

const protectedRoutes = ['/home']
const publicRoutes = ['/signin', '/signup']

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)


  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/home')
  ) {
    console.log('shit naman')
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}