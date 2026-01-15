import { mockGoods, mockCategories, mockNews, mockShop } from './mock-data';
import type { IGood, IGoodCategory } from '@/types';

/**
 * Получить товар по ID
 */
/*
export function getGoodById(id: string | number): IGood | undefined {
  const strId = id.toString();
  return mockGoods.find(good => good.id === strId);
}
*/

/**
 * Получить товары по категории
 */
export function getGoodsByCategory(categoryId: string): IGood[] {
  return mockGoods.filter(good => good.categoryId === categoryId);
}

/**
 * Получить категорию по ID
 */
export function getCategoryById(id: string | number): IGoodCategory | undefined {
  const strId = id.toString();
  return mockCategories.find(cat => cat.id === strId);
}

/**
 * Получить корневые категории (без parentId)
 */
export function getRootCategories(): IGoodCategory[] {
  return mockCategories.filter(cat => cat.parentId === null);
}

/**
 * Получить дочерние категории
 */
export function getChildCategories(parentId: string): IGoodCategory[] {
  return mockCategories.filter(cat => cat.parentId === parentId);
}

/**
 * Поиск товаров по названию
 */
export function searchGoods(query: string): IGood[] {
  const q = query.toLowerCase();
  return mockGoods.filter(good =>
    good.name.toLowerCase().includes(q) ||
    good.description.toLowerCase().includes(q)
  );
}

/**
 * Фильтрация товаров
 */
export function filterGoods(options: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
}): IGood[] {
  return mockGoods.filter(good => {
    if (options.categoryId && good.categoryId !== options.categoryId) return false;
    if (options.minPrice && good.price < options.minPrice) return false;
    if (options.maxPrice && good.price > options.maxPrice) return false;
    if (options.brand && good.brand !== options.brand) return false;
    if (options.inStock !== undefined && good.inStock !== options.inStock) return false;
    return true;
  });
}

/**
 * Получить данные магазина
 */
export function getShopData() {
  return mockShop;
}

/**
 * Получить последние новости
 */
export function getLatestNews(limit?: number) {
  return limit ? mockNews.slice(0, limit) : mockNews;
}

/*
export {
  getGoodById,
  getGoodsByCategory,
  getCategoryById,
  getRootCategories,
  getChildCategories,
  searchGoods,
  filterGoods,
  getShopData,
  getLatestNews,
};
*/
