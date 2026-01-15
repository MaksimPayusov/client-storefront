import { apiClient } from './api';

export interface YandexDeliveryConfig {
  sourcePlatformStation: string;
  defaultWeight: number;
  apiAvailable: boolean;
}

export interface PickupPoint {
  id: string;
  address: string;
  city?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  deliveryTerm?: number;
  type?: string;
  schedule?: string;
  phone?: string;
}

export interface DeliveryCalculationRequest {
  weight: number;
  fromLocation: {
    latitude: number;
    longitude: number;
  };
  toLocation: {
    latitude: number;
    longitude: number;
  };
}

export interface DeliveryCalculationResponse {
  price: number;
  deliveryTerm: number;
  pickupPoints: PickupPoint[];
}

class YandexDeliveryService {
  private readonly baseUrl = '/api/yandex-delivery';

  /**
   * Получить конфигурацию для виджета
   */
  async getConfig(): Promise<YandexDeliveryConfig> {
    try {
      const response = await apiClient.get<YandexDeliveryConfig>(`${this.baseUrl}/config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Yandex Delivery config:', error);
      // Возвращаем дефолтную конфигурацию
      return {
        sourcePlatformStation: '05e809bb-4521-42d9-a936-0fb0744c0fb3',
        defaultWeight: 10000,
        apiAvailable: false,
      };
    }
  }

  /**
   * Получить список пунктов выдачи
   */
  async getPickupPoints(city?: string, latitude?: number, longitude?: number): Promise<PickupPoint[]> {
    try {
      const params: any = {};
      if (city) params.city = city;
      if (latitude) params.latitude = latitude;
      if (longitude) params.longitude = longitude;

      const response = await apiClient.get<PickupPoint[]>(`${this.baseUrl}/pickup-points`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pickup points:', error);
      return [];
    }
  }

  /**
   * Рассчитать стоимость и сроки доставки
   */
  async calculateDelivery(request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse> {
    try {
      const response = await apiClient.post<DeliveryCalculationResponse>(
        `${this.baseUrl}/calculate`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating delivery:', error);
      throw error;
    }
  }

  /**
   * Универсальный прокси для виджета
   */
  async widgetProxy(endpoint: string, data: any): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/widget-proxy`, {
        endpoint,
        ...data,
      });
      return response.data;
    } catch (error) {
      console.error('Error in widget proxy:', error);
      throw error;
    }
  }
}

export const yandexDeliveryService = new YandexDeliveryService();
