// БАЗОВЫЕ ТИПЫ

// ДЛЯ ИЗБРАННОГО
export interface IFavoriteItem {
  productId: IGood['id'];
  addedAt: Date;
}

// ПОЛЬЗОВАТЕЛЬ
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  isVerified?: boolean;
  role?: 'user' | 'admin' | 'owner';
}

// АВТОРИЗАЦИЯ
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  refreshToken?: string;
}

export interface IResetPasswordRequest {
  email: string;
}

export interface IConfirmPasswordRequest {
  token: string;
  password: string;
}

// КАТЕГОРИИ ТОВАРОВ (из ТЗ API 5.2)

export interface IGoodCategory {
  id: string;
  name: string;
  description: string;
  parentId: IGoodCategory['id'] | null;
  shopId?: string;
  imageUrl?: string;
  isActive?: boolean;
  // Дополнительные поля для UI
  image?: string;
  slug?: string;
  // Для дерева
  children?: IGoodCategory[]; // Дочерние категории (для отображения дерева)
  level?: number; // Уровень вложенности
}

export interface IGoodCategoriesListResponse {
  totalCount: number;
  nextPage: string | null;
  prevPage: string | null;
  items: IGoodCategory[];
}

// ТОВАРЫ (из ТЗ API 5.3 + админки)

export interface IGood {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: IGoodCategory['id'];
  oldPrice?: number;
  sku?: string;
  stockQuantity?: number;
  isActive?: boolean;
  attributes?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  // Дополнительные поля из админки
  image?: string;
  images?: string[]; // Для галереи
  brand?: string;
  sizes?: string[]; // Размеры одежды
  color?: string;
  // Для UI/UX
  inStock?: boolean;
}

export interface IGoodListResponse {
  totalCount: number;
  nextPage: string | null;
  prevPage: string | null;
  items: IGood[];
}

// КОРЗИНА (из ТЗ API 5.7)

export interface IBasketItem {
  id: string;
  goodId: IGood['id'];
  count: number;
  // Для отображения в UI можно добавить
  good?: IGood; // Полная информация о товаре
}

export interface IAddToBasketRequestBody {
  goodId: IGood['id'];
  count: number;
}

// МЕТОДЫ ОПЛАТЫ (из ТЗ API 5.4)

export interface IPaymentMethod {
  id: string | number;
  title: string;
  description: string;
  image?: string; // Логотип метода оплаты
}

// СПОСОБЫ ДОСТАВКИ (из ТЗ API 5.5)

export interface IDeliveryMethod {
  id: string | number;
  title: string;
  description: string;
  price?: number; // Стоимость доставки
  estimatedDays?: number; // Срок доставки
}

// ПОЛУЧАТЕЛИ (из ТЗ API 5.6)

export interface IRecipient {
  id: string | number;
  userId: IUser['id'];
  firstName: string;
  lastName: string;
  middleName: string;
  address: string;
  zipCode: string;
  phone: string;
  email?: string; // Дополнительно
  isDefault?: boolean; // По умолчанию
}

// ЧЕК-АУТ И ТРАНЗАКЦИИ (из ТЗ API 5.8)

export interface ICheckout {
  id: string;
  user: IUser['id'];
  recipientId: IRecipient['id'];
  basketId: string; // Или более специфичный тип для корзины
  paymentMethodId: IPaymentMethod['id'];
  deliveryMethodId: IDeliveryMethod['id'];
  paymentTotal: number;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt?: Date;
}

export interface ITransaction {
  id: string;
  created: Date;
  updated: Date;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  amount: number;
  checkoutId: ICheckout['id'];
  providerData: any; // Ответ платежной системы
}

// МАГАЗИН (из админки)

export interface IShop {
  id: string;
  name: string;
  domain: string;
  description?: string;
  coverImage?: string;
  logoUrl?: string;
  bannerUrl?: string;
  theme?: string;
  categories: string[]; // ID категорий
  brands: string[]; // Названия брендов
  // Дата создания и обновления
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  // Цветовая тема магазина
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  // Можно добавить больше полей по необходимости
}

// НОВОСТИ/БЛОГ (из админки)

export interface INews {
  id: string;
  title: string;
  content: string;
  image?: string;
  imageUrl?: string;
  publishedAt?: Date | string; // ← Date ИЛИ string
  excerpt?: string;
  author?: string;
  isPublished?: boolean;
  views?: number;
  tags?: string[];
  shopId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// БРЕНДЫ (из админки + расширение)

export interface IBrand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  shopId?: string;
  isActive?: boolean;
}

// РАЗМЕРЫ (из ТЗ модуля "Размеры")

export interface ISize {
  id: string | number;
  title: string;
  description?: string;
  categoryId?: IGoodCategory['id']; // Для привязки к категории
}

// API RESPONSE ОБЩИЕ ТИПЫ

export interface IApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface IPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ДЛЯ ФОРМ И UI

export interface IFormError {
  field: string;
  message: string;
}

// ДЛЯ ФИЛЬТРОВ КАТАЛОГА

export interface ICatalogFilters {
  categories?: IGoodCategory['id'][];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

// Экспортируем все типы
/*
export type {
  ILoginBody,
  ILoginConfirmBody,
  IGoodCategory,
  IGoodCategoriesListResponse,
  IGood,
  IGoodListResponse,
  IBasketItem,
  IAddToBasketRequestBody,
  IPaymentMethod,
  IDeliveryMethod,
  IRecipient,
  ICheckout,
  ITransaction,
  IShop,
  INews,
  IBrand,
  ISize,
  IApiResponse,
  IPaginatedResponse,
  IFormError,
  ICatalogFilters,
};
*/
