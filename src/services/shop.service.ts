/**
 * Сервис для работы с магазинами
 */

import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

// Типы
export interface Shop {
  id: string;
  name: string;
  description: string;
  domain: string;
  url: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopRequest {
  name: string;
  description: string;
  domain: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface UpdateShopRequest {
  name?: string;
  description?: string;
  domain?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

class ShopService {
  /**
   * Получение магазина по URL (для клиентского фронтенда)
   */
  async getShopByUrl(shopUrl: string): Promise<Shop> {
    const response = await apiClient.get<Shop>(
      buildPath(API_PATHS.SHOP_BY_URL, { shopUrl })
    );
    return response.data;
  }

  /**
   * Получение магазина по ID
   */
  async getShopById(shopId: string): Promise<Shop> {
    const response = await apiClient.get<Shop>(
      buildPath(API_PATHS.SHOP_BY_ID, { shopId })
    );
    return response.data;
  }

  /**
   * Создание магазина (для админки)
   */
  async createShop(data: CreateShopRequest): Promise<Shop> {
    const response = await apiClient.post<Shop>(
      API_PATHS.SHOPS,
      data
    );
    return response.data;
  }

  /**
   * Получение всех магазинов
   */
  async getAllShops(): Promise<Shop[]> {
    const response = await apiClient.get<Shop[]>(
      API_PATHS.SHOPS
    );
    return response.data;
  }

  /**
   * Получение магазинов владельца
   */
  async getMyShops(): Promise<Shop[]> {
    const response = await apiClient.get<Shop[]>(
      API_PATHS.MY_SHOPS
    );
    return response.data;
  }

  /**
   * Обновление магазина
   */
  async updateShop(shopId: string, data: UpdateShopRequest): Promise<Shop> {
    const response = await apiClient.put<Shop>(
      buildPath(API_PATHS.SHOP_BY_ID, { shopId }),
      data
    );
    return response.data;
  }

  /**
   * Удаление магазина
   */
  async deleteShop(shopId: string): Promise<void> {
    await apiClient.delete(
      buildPath(API_PATHS.SHOP_BY_ID, { shopId })
    );
  }

  /**
   * Определение домена магазина из URL
   */
  getShopDomainFromUrl(): string {
    if (typeof window === 'undefined') return 'default';

    const hostname = window.location.hostname;

    // Проверяем, есть ли поддомен
    const parts = hostname.split('.');

    // Если это localhost или IP адрес
    if (parts.length <= 2 || parts.includes('localhost')) {
      // Пробуем получить из query параметра
      const urlParams = new URLSearchParams(window.location.search);
      const shopDomain = urlParams.get('shop');
      return shopDomain || 'fashion-store';
    }

    // Первая часть - поддомен (например: fashion-store.fashionconstruct.ru)
    return parts[0];
  }

  /**
   * Получение настроек магазина для текущего домена
   */
  async getCurrentShop(): Promise<Shop | null> {
    try {
      const shopDomain = this.getShopDomainFromUrl();
      return await this.getShopByUrl(shopDomain);
    } catch (error) {
      console.error('Error getting current shop:', error);
      return null;
    }
  }
}

// Создаём и экспортируем singleton экземпляр
export const shopService = new ShopService();
export default shopService;