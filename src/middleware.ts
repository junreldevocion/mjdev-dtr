import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/session'

const protectedRoutes = ['/home']
const publicRoutes = ['/signin', '/signup']
const maintenanceRoutes = ['/maintenance']

const shutdownText = process.env.SHUTDOWN

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname
  const defaultPath = '/'

  const isShutdown = shutdownText === 'true'

  const isMaintenanceRoute = maintenanceRoutes.includes(path)

  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (isShutdown && (isProtectedRoute || isPublicRoute || path === defaultPath)) {
    console.log('Server is shutting down')
    return NextResponse.redirect(new URL('/maintenance', req.nextUrl))
  }

  if (path === defaultPath && session?.userId) {
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

  if (path === defaultPath && !session?.userId) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }


  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  if (isMaintenanceRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  if (isMaintenanceRoute && session?.userId) {
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

  if (
    isPublicRoute &&
    session?.userId
  ) {
    return NextResponse.redirect(new URL('/home', req.nextUrl))
  }

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}