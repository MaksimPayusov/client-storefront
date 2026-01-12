import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Защищенные роуты
const protectedRoutes = ['/account', '/checkout', '/checkout/success']
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some(route =>
    path.startsWith(route)
  )

  const isAuthRoute = authRoutes.includes(path)

  // В реальном приложении здесь должна быть проверка JWT токена
  // Извлекаем токен из кук
  const token = request.cookies.get('auth-token')?.value

  // Для дебага в Docker - логируем только важные события
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware:', {
      path,
      isProtectedRoute,
      isAuthRoute,
      hasToken: !!token
    });
  }

  // Если это protected route и нет токена - редирект на логин
  if (isProtectedRoute && !token) {
    console.log('Redirecting to login (no token)');
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // Если пользователь уже авторизован и пытается зайти на страницу авторизации
  if (isAuthRoute && token) {
    console.log('Redirecting to account (already authenticated)');
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/auth/login',
    '/auth/register',
  ],
}