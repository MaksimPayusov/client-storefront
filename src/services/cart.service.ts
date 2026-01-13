/**
 * Сервис для работы с корзиной
 */

import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

// Типы
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
  maxQuantity: number;
}

export interface CartResponse {
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  lastUpdated: string;
}

export interface AddItemRequest {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

class CartService {
  /**
   * Получение корзины пользователя
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await apiClient.get<CartResponse>(API_PATHS.CART);
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      // Возвращаем пустую корзину при ошибке
      return {
        userId: '',
        items: [],
        totalItems: 0,
        totalAmount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  /**
   * Добавление товара в корзину
   */
  async addItem(request: AddItemRequest): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>(
      API_PATHS.CART_ADD,
      request
    );
    return response.data;
  }

  /**
   * Обновление количества товара
   */
  async updateQuantity(productId: string, quantity: number): Promise<CartResponse> {
    if (quantity < 1) {
      // Если количество 0, удаляем товар
      return this.removeItem(productId);
    }

    const response = await apiClient.patch<CartResponse>(
      buildPath(API_PATHS.CART_ITEM, { itemId: productId }),
      { quantity }
    );
    return response.data;
  }

  /**
   * Удаление товара из корзины
   */
  async removeItem(productId: string): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(
      buildPath(API_PATHS.CART_ITEM, { itemId: productId })
    );
    return response.data;
  }

  /**
   * Очистка корзины
   */
  async clearCart(): Promise<void> {
    await apiClient.delete(API_PATHS.CART);
  }

  /**
   * Синхронизация локальной корзины с сервером
   */
  async syncCart(localItems: CartItem[]): Promise<CartResponse> {
    // Получаем текущую корзину с сервера
    const serverCart = await this.getCart();

    // Если локальная корзина пуста, возвращаем серверную
    if (localItems.length === 0) {
      return serverCart;
    }

    // Синхронизируем каждый товар
    for (const localItem of localItems) {
      try {
        await this.addItem({
          productId: localItem.productId,
          quantity: localItem.quantity,
          size: localItem.size,
          color: localItem.color,
        });
      } catch (error) {
        console.error(`Error syncing item ${localItem.productId}:`, error);
      }
    }

    // Получаем обновлённую корзину
    return this.getCart();
  }

  /**
   * Расчет стоимости корзины
   */
  calculateCartTotal(items: CartItem[]): {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 300; // Бесплатная доставка от 1000 руб
    const tax = subtotal * 0.2; // НДС 20%
    const total = subtotal + shipping + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Проверка доступности товаров в корзине
   */
  async validateCart(): Promise<{
    valid: boolean;
    unavailableItems: CartItem[];
    updatedCart?: CartResponse;
  }> {
    const cart = await this.getCart();
    const unavailableItems: CartItem[] = [];

    // TODO: Здесь должна быть логика проверки доступности товаров
    // Например, проверка остатков на складе

    return {
      valid: unavailableItems.length === 0,
      unavailableItems,
    };
  }

  /**
   * Объединение анонимной и авторизованной корзины
   */
  async mergeCarts(anonymousCartItems: CartItem[]): Promise<CartResponse> {
    const currentCart = await this.getCart();

    // Создаём карту текущих товаров для быстрого поиска
    const currentItemsMap = new Map(
      currentCart.items.map(item => [item.productId, item])
    );

    // Объединяем товары
    const mergedItems = [...currentCart.items];

    for (const anonymousItem of anonymousCartItems) {
      const existingItem = currentItemsMap.get(anonymousItem.productId);

      if (existingItem) {
        // Объединяем количество
        existingItem.quantity += anonymousItem.quantity;
      } else {
        // Добавляем новый товар
        mergedItems.push(anonymousItem);
      }
    }

    // Синхронизируем с сервером
    await this.clearCart();

    for (const item of mergedItems) {
      await this.addItem({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    return this.getCart();
  }
}

// Создаём и экспортируем singleton экземпляр
export const cartService = new CartService();
export default cartService;