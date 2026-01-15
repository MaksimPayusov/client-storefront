/**
 * Константы с путями API эндпоинтов
 */

const API_BASE =
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081');

export const API_PATHS = {
  // Аутентификация
  AUTH_LOGIN: `${API_BASE}/auth/login`,
  AUTH_REFRESH: `${API_BASE}/auth/refresh`,
  AUTH_REGISTER: `${API_BASE}/register`,
  AUTH_REGISTER_OWNER: `${API_BASE}/auth/registerowner`,
  AUTH_USER_ROLES: `${API_BASE}/auth/user/:userId/roles`,
  AUTH_ASSIGN_ROLE: `${API_BASE}/auth/assign-role`,

  // Магазины
  SHOPS: `${API_BASE}/api/shops`,
  SHOP_BY_ID: `${API_BASE}/api/shops/:shopId`,
  SHOP_BY_URL: `${API_BASE}/api/shops/url/:shopUrl`,
  SHOPS_BY_OWNER: `${API_BASE}/api/shops/owner/:ownerId`,
  MY_SHOPS: `${API_BASE}/api/shops/my-shops`,

  // Товары
  PRODUCTS: `${API_BASE}/api/products`,
  PRODUCT_BY_ID: `${API_BASE}/api/products/:id`,
  PRODUCTS_SEARCH: `${API_BASE}/api/products/search`,
  PRODUCTS_BY_SHOP: `${API_BASE}/api/products/shop/:shopId/active`,

  // Категории
  CATEGORIES: `${API_BASE}/api/categories`,
  CATEGORIES_BY_SHOP: `${API_BASE}/api/categories/shop/:shopId`,

  // Бренды
  BRANDS: `${API_BASE}/api/brands`,
  BRANDS_BY_SHOP: `${API_BASE}/api/brands/shop/:shopId`,

  // Размеры
  SIZES: `${API_BASE}/api/sizes`,
  PRODUCT_SIZES_BY_PRODUCT: `${API_BASE}/api/product-sizes/product/:productId`,

  // Корзина
  CART: `${API_BASE}/api/cart`,
  CART_ADD: `${API_BASE}/api/cart/add`,
  CART_ITEM: `${API_BASE}/api/cart/items/:itemId`,

  // Заказы
  ORDERS: `${API_BASE}/api/orders`,
  ORDER_BY_ID: `${API_BASE}/api/orders/:orderId`,
  ORDER_UPDATE_STATUS: `${API_BASE}/api/orders/:orderId/status`,

  // Методы доставки и оплаты
  DELIVERY_METHODS: `${API_BASE}/api/delivery-methods`,
  PAYMENT_METHODS: `${API_BASE}/api/payment-methods`,

  // Новости
  NEWS: `${API_BASE}/api/news`,
  NEWS_BY_SLUG: `${API_BASE}/api/news/:slug`,
  NEWS_ADMIN_ALL: `${API_BASE}/api/news/admin/all`,

  // Файлы
  FILES_UPLOAD: `${API_BASE}/api/files/upload`,
  FILES_UPLOAD_CATEGORY: `${API_BASE}/api/files/upload/:category`,
  FILES_DOWNLOAD: `${API_BASE}/api/files/download/:fileName`,

  // Получатели адресов
  USERS_ME_RECIPIENTS: `${API_BASE}/api/users/me/recipients`,
} as const;

// Вспомогательные функции для подстановки параметров
export const buildPath = (path: string, params: Record<string, string | number>): string => {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value.toString());
  });
  return result;
};
