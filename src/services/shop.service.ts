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
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
  designCode?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendShopResponse {
  id: string;
  shopName: string;
  shopUrl: string;
  description?: string;
  pfpUrl?: string;
  designCode?: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
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
    const response = await apiClient.get<BackendShopResponse>(
      buildPath(API_PATHS.SHOP_BY_URL, { shopUrl })
    );

    const data = response.data;

    return {
      id: data.id,
      name: data.shopName,
      description: data.description || '',
      domain: data.shopUrl,
      url: data.shopUrl,
      logoUrl: data.pfpUrl,
      bannerUrl: undefined,
      designCode: data.designCode,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || data.createdAt,
      isActive: true,
      primaryColor: undefined,
      secondaryColor: undefined,
    };
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
    const response = await apiClient.get<BackendShopResponse[]>(
      API_PATHS.SHOPS
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map((data) => ({
      id: data.id,
      name: data.shopName,
      description: data.description || '',
      domain: data.shopUrl,
      url: data.shopUrl,
      logoUrl: data.pfpUrl,
      bannerUrl: undefined,
      designCode: data.designCode,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || data.createdAt,
      isActive: true,
      primaryColor: undefined,
      secondaryColor: undefined,
    }));
  }

  /**
   * Получение магазинов владельца
   */
  async getMyShops(): Promise<Shop[]> {
    const response = await apiClient.get<BackendShopResponse[]>(
      API_PATHS.MY_SHOPS
    );

    const items = Array.isArray(response.data) ? response.data : [];
    return items.map((data) => ({
      id: data.id,
      name: data.shopName,
      description: data.description || '',
      domain: data.shopUrl,
      url: data.shopUrl,
      logoUrl: data.pfpUrl,
      bannerUrl: undefined,
      designCode: data.designCode,
      ownerId: data.ownerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || data.createdAt,
      isActive: true,
      primaryColor: undefined,
      secondaryColor: undefined,
    }));
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
    const isIpAddress = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);

    const setShopCookie = (value: string) => {
      try {
        const encoded = encodeURIComponent(value);
        document.cookie = `shop=${encoded}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      } catch {
        // noop
      }
    };

    const getShopCookie = () => {
      try {
        const match = document.cookie.match(/(?:^|; )shop=([^;]+)/);
        if (!match) return null;
        return decodeURIComponent(match[1]);
      } catch {
        return null;
      }
    };

    // Явное переопределение через query параметр имеет приоритет всегда
    const urlParams = new URLSearchParams(window.location.search);
    const shopFromQuery = urlParams.get('shop');
    if (shopFromQuery) {
      setShopCookie(shopFromQuery);
      return shopFromQuery;
    }

    // Проверяем, есть ли поддомен
    const parts = hostname.split('.');

    // Если это localhost или IP адрес
    if (parts.length <= 2 || parts.includes('localhost') || isIpAddress) {
      const fromCookie = getShopCookie();
      if (fromCookie) return fromCookie;

      // Если ничего не выбрано, оставляем 'default' и даём провайдеру авто-выбрать магазин
      return 'default';
    }

    // Первая часть - поддомен (например: <subdomain>.fashionconstruct.ru)
    const subdomain = parts[0];
    if (subdomain) setShopCookie(subdomain);
    return subdomain;
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
