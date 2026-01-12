/**
 * Утилиты для определения окружения
 */

export const isDevelopment =
  process.env.NODE_ENV === 'development';

export const isDebugMode =
  process.env.NEXT_PUBLIC_DEBUG === 'true';

export const isProduction =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_DEBUG !== 'true';

// Логирование для дебага
export function logEnv() {
  if (typeof window !== 'undefined') {
    console.log('[ENV] Client side:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
      isDevelopment,
      isProduction,
      isDebugMode,
    });
  }
}