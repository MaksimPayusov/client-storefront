import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Защищенные роуты
const protectedRoutes = ['/account', '/checkout/success']
const authRoutes = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some(route =>
    path.startsWith(route)
  )

  const isAuthRoute = authRoutes.includes(path)

  // Проверяем JWT токен
  let isAuthenticated = false
  let token = null

  try {
    // Проверяем наличие токена в куках (для серверного рендеринга)
    token = request.cookies.get('auth_token')?.value

    // В middleware нельзя полагаться на localStorage (он недоступен на сервере).
    // Поэтому здесь считаем пользователя авторизованным только если токен пришёл в cookie.
    isAuthenticated = Boolean(token)
  } catch (error) {
    console.error('Error checking auth:', error)
    isAuthenticated = false
  }

  // Для дебага в Docker - логируем только важные события
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware:', {
      path,
      isProtectedRoute,
      isAuthRoute,
      isAuthenticated,
      hasToken: !!token
    });
  }

  // Если это protected route и пользователь не авторизован - редирект на логин
  if (isProtectedRoute && !isAuthenticated) {
    console.log('Redirecting to login (not authenticated)');
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', path)

    // Создаем response с редиректом
    const response = NextResponse.redirect(loginUrl)

    // Очищаем возможные устаревшие куки
    response.cookies.delete('auth_token')

    return response
  }

  // Если пользователь уже авторизован и пытается зайти на страницу авторизации
  if (isAuthRoute && isAuthenticated) {
    console.log('Redirecting to account (already authenticated)');
    return NextResponse.redirect(new URL('/account', request.url))
  }

  const response = NextResponse.next()

  // Если есть токен, обновляем куку (для SSR)
  if (token) {
    response.cookies.set({
      name: 'auth_token',
      value: token,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
    })
  }

  return response
}

export const config = {
  matcher: [
    '/account/:path*',
    '/auth/login',
    '/auth/register',
  ],
}
