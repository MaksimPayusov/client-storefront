import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы Tailwind без конфликтов
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирование цены
 */
export function formatPrice(price: number, currency: string = '₽'): string {
  return `${price.toLocaleString('ru-RU')} ${currency}`;
}

/**
 * Обрезание текста
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Безопасное получение URL изображения
 * Заменяет невалидные URL на fallback
 */
export function getSafeImageUrl(
  url?: string,
  fallback: string = '/images/placeholder.svg'
): string {
  if (!url) return fallback;

  // Проверяем, является ли URL валидным
  try {
    new URL(url);
    return url;
  } catch {
    // Если это относительный путь
    if (url.startsWith('/')) {
      return url;
    }
    return fallback;
  }
}