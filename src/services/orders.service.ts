/**
 * Сервис для работы с заказами
 */

import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

// Типы
export interface OrderItem {
  productId: string;
  shopId: string;
  quantity: number;
  pricePerItem: number;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  street: string;
  apartment?: string;
  postalCode: string;
}

export interface YandexDeliverySelection {
  pickupPointId?: string;
  pickupPointAddress?: string;
  pickupPointName?: string;
  latitude?: number;
  longitude?: number;
  deliveryPrice?: number;
  deliveryTerm?: number;
  pickupPointType?: string;
  workSchedule?: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  recipientId: string;
  items: OrderItem[];
  status: 'NEW' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED';
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  createdAt: string;
  yandexPickupPointId?: string;
  yandexPickupPointAddress?: string;
  yandexPickupPointName?: string;
  yandexLatitude?: number;
  yandexLongitude?: number;
  yandexDeliveryPrice?: number;
  yandexDeliveryTerm?: number;
  yandexPickupPointType?: string;
  yandexWorkSchedule?: string;
  yandexPhone?: string;
}

export interface CreateOrderRequest {
  recipientId: string;
  items: Array<{
    productId: string;
    shopId: string;
    quantity: number;
    pricePerItem: number;
  }>;
  deliveryMethodId: string;
  paymentMethodId: string;
  yandexDelivery?: YandexDeliverySelection;
}

export interface YooKassaPaymentResponse {
  id: string;
  status: string;
  amount?: {
    value: string;
    currency: string;
  };
  confirmation?: {
    type?: string;
    confirmationUrl?: string;
    confirmation_url?: string;
    confirmationToken?: string;
    confirmation_token?: string;
  };
  createdAt?: string;
  description?: string;
  test?: boolean;
  paid?: boolean;
  refundable?: boolean;
  metadata?: any;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

class OrderService {
  private getUserIdHeader(): { 'X-User-Id'?: string } {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem('auth-storage');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      const userId = parsed?.state?.user?.id;
      if (!userId) return {};
      return { 'X-User-Id': userId };
    } catch {
      return {};
    }
  }

  /**
   * Создание заказа
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>(
      API_PATHS.ORDERS,
      data,
      { headers: this.getUserIdHeader() }
    );
    return response.data;
  }

  /**
   * Получение заказов пользователя
   */
  async getUserOrders(params?: {
    shopId?: string;
    status?: Order['status'];
    page?: number;
    size?: number;
  }): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(
      API_PATHS.ORDERS,
      { params, headers: this.getUserIdHeader() }
    );
    return response.data;
  }

  /**
   * Получение заказа по ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(
      buildPath(API_PATHS.ORDER_BY_ID, { orderId }),
      { headers: this.getUserIdHeader() }
    );
    return response.data;
  }

  /**
   * Создание платежа YooKassa
   */
  async createYooKassaPayment(params: {
    amount: string;
    currency?: string;
    description: string;
    orderId?: string;
    returnUrl?: string;
  }): Promise<YooKassaPaymentResponse> {
    const response = await apiClient.post<YooKassaPaymentResponse>(
      `${API_PATHS.PAYMENT_METHODS}/yookassa/create-payment`,
      null,
      { params }
    );
    return response.data;
  }

  /**
   * Получение методов доставки
   */
  async getDeliveryMethods(): Promise<DeliveryMethod[]> {
    const response = await apiClient.get<DeliveryMethod[]>(
      API_PATHS.DELIVERY_METHODS
    );
    return response.data;
  }

  /**
   * Получение методов оплаты
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethod[]>(
      API_PATHS.PAYMENT_METHODS
    );
    return response.data;
  }

  /**
   * Обновление статуса заказа
   */
  async updateOrderStatus(orderId: string, status: UpdateOrderStatusRequest): Promise<Order> {
    const response = await apiClient.patch<Order>(
      buildPath(API_PATHS.ORDER_UPDATE_STATUS, { orderId }),
      status
    );
    return response.data;
  }

  /**
   * Отмена заказа
   */
  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus(orderId, {
      status: 'CANCELED',
    });
  }

  /**
   * Проверка возможности доставки по адресу
   */
  async validateShippingAddress(address: ShippingAddress, shopId: string): Promise<{
    valid: boolean;
    availableMethods: DeliveryMethod[];
    message?: string;
  }> {
    try {
      const methods = await this.getDeliveryMethods();
      // Фильтруем методы доставки для данного магазина/региона
      const availableMethods = methods.filter(method => method.isActive);

      return {
        valid: availableMethods.length > 0,
        availableMethods,
        message: availableMethods.length === 0 ? 'Доставка в указанный регион не доступна' : undefined,
      };
    } catch (error) {
      return {
        valid: false,
        availableMethods: [],
        message: 'Ошибка проверки адреса',
      };
    }
  }

  /**
   * Расчет стоимости заказа
   */
  async calculateOrderTotal(request: CreateOrderRequest): Promise<{
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    deliveryMethod?: DeliveryMethod;
    paymentMethod?: PaymentMethod;
  }> {
    // Получаем выбранный метод доставки
    const deliveryMethods = await this.getDeliveryMethods();
    const deliveryMethod = deliveryMethods.find(m => m.id === request.deliveryMethodId);

    if (!deliveryMethod) {
      throw new Error('Выбранный метод доставки не найден');
    }

    // Получаем выбранный метод оплаты
    const paymentMethods = await this.getPaymentMethods();
    const paymentMethod = paymentMethods.find(m => m.id === request.paymentMethodId);

    if (!paymentMethod) {
      throw new Error('Выбранный метод оплаты не найден');
    }

    // TODO: Здесь должна быть логика расчета стоимости товаров
    // Пока используем mock данные
    const subtotal = request.items.reduce((sum, item) => sum + (item.quantity * 1000), 0); // Пример
    const shipping = deliveryMethod.price;
    const tax = subtotal * 0.2; // НДС 20%
    const total = subtotal + shipping + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      deliveryMethod,
      paymentMethod,
    };
  }

  /**
   * Отправка подтверждения заказа
   */
  async sendOrderConfirmation(orderId: string): Promise<boolean> {
    try {
      const order = await this.getOrderById(orderId);

      // TODO: Реализовать отправку email уведомления
      console.log('Order confirmation sent:', {
        toUserId: order.userId,
        orderId: order.id,
        totalAmount: order.totalAmount,
      });

      return true;
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return false;
    }
  }

  /**
   * Генерация номера заказа
   */
  generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `ORD-${year}${month}${day}-${random}`;
  }

  /**
   * Получение истории заказов
   */
  async getOrderHistory(limit: number = 10): Promise<Order[]> {
    const orders = await this.getUserOrders();
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

// Создаём и экспортируем singleton экземпляр
export const orderService = new OrderService();
export default orderService;