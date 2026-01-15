import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { orderService } from '@/services/orders.service'

// Типы
export interface OrderItem {
  productId: string
  shopId: string
  quantity: number
  pricePerItem: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  phone: string
  email: string
  country: string
  city: string
  street: string
  apartment?: string
  postalCode: string
}

export interface DeliveryMethod {
  id: string
  name: string
  description?: string
  price: number
  estimatedDays: number
  isActive: boolean
}

export interface PaymentMethod {
  id: string
  name: string
  description?: string
  isActive: boolean
}

const defaultDeliveryMethods: DeliveryMethod[] = [
  {
    id: 'yandex',
    name: 'Яндекс.Доставка',
    description: 'Пункт выдачи или курьер Яндекс',
    price: 0,
    estimatedDays: 1,
    isActive: true,
  },
];

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Наличные',
    description: 'Оплата при получении',
    isActive: true,
  },
  {
    id: 'yookassa',
    name: 'YooKassa',
    description: 'Оплата картой онлайн',
    isActive: true,
  },
];

export interface YandexDeliverySelection {
  pickupPointId?: string
  pickupPointAddress?: string
  pickupPointName?: string
  latitude?: number
  longitude?: number
  deliveryPrice?: number
  deliveryTerm?: number
  pickupPointType?: string
  workSchedule?: string
  phone?: string
}

export interface Order {
  id: string
  userId: string
  recipientId: string
  items: OrderItem[]
  status: 'NEW' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED'
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  createdAt: string
  totalAmount: number
  yandexPickupPointId?: string
  yandexPickupPointAddress?: string
  yandexPickupPointName?: string
  yandexLatitude?: number
  yandexLongitude?: number
  yandexDeliveryPrice?: number
  yandexDeliveryTerm?: number
  yandexPickupPointType?: string
  yandexWorkSchedule?: string
  yandexPhone?: string
}

interface OrderState {
  // Данные заказов
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null

  // Методы доставки и оплаты
  deliveryMethods: DeliveryMethod[]
  paymentMethods: PaymentMethod[]

  // Адрес доставки
  shippingAddress: ShippingAddress | null

  // Действия
  loadOrders: () => Promise<void>
  loadOrderById: (orderId: string) => Promise<void>
  createOrder: (data: {
    recipientId: string
    items: Array<{
      productId: string
      shopId: string
      quantity: number
      pricePerItem: number
    }>
    deliveryMethodId: string
    paymentMethodId: string
    yandexDelivery?: YandexDeliverySelection
  }) => Promise<Order>
  cancelOrder: (orderId: string) => Promise<void>
  loadDeliveryMethods: () => Promise<void>
  loadPaymentMethods: () => Promise<void>
  setShippingAddress: (address: ShippingAddress) => void
  clearShippingAddress: () => void
  clearCurrentOrder: () => void
  clearError: () => void

  // Геттеры
  getUserOrders: () => Order[]
  getOrderById: (id: string) => Order | undefined
  getOrderByNumber: (orderNumber: string) => Order | undefined
  getOrdersByStatus: (status: Order['status']) => Order[]
  getPendingOrders: () => Order[]
  getCompletedOrders: () => Order[]
  calculateOrderSummary: (items: OrderItem[], deliveryMethod?: DeliveryMethod) => {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,
      deliveryMethods: defaultDeliveryMethods,
      paymentMethods: defaultPaymentMethods,
      shippingAddress: null,

      loadOrders: async () => {
        set({ isLoading: true, error: null })

        try {
          const orders = await orderService.getUserOrders()
          set({
            orders,
            isLoading: false
          })
        } catch (error: any) {
          console.error('Error loading orders:', error)

          set({
            isLoading: false,
            error: 'Ошибка загрузки заказов',
          })
        }
      },

      loadOrderById: async (orderId: string) => {
        set({ isLoading: true, error: null })

        try {
          const order = await orderService.getOrderById(orderId)
          set({
            currentOrder: order,
            isLoading: false
          })
        } catch (error: any) {
          console.error('Error loading order:', error)

          set({
            isLoading: false,
            error: 'Ошибка загрузки заказа',
          })
        }
      },

      createOrder: async (data) => {
        set({ isLoading: true, error: null })

        try {
          const order = await orderService.createOrder(data)

          // Добавляем новый заказ в список
          set(state => ({
            orders: [order, ...state.orders],
            currentOrder: order,
            isLoading: false,
            error: null
          }))

          // Отправляем подтверждение
          await orderService.sendOrderConfirmation(order.id)

          return order
        } catch (error: any) {
          console.error('Error creating order:', error)

          let errorMessage = 'Ошибка создания заказа'
          if (error.response?.status === 400) {
            errorMessage = 'Неверные данные заказа'
          } else if (error.response?.status === 422) {
            errorMessage = 'Ошибка валидации данных'
          }

          set({
            isLoading: false,
            error: errorMessage,
          })

          throw new Error(errorMessage)
        }
      },

      cancelOrder: async (orderId: string) => {
        set({ isLoading: true, error: null })

        try {
          const order = await orderService.cancelOrder(orderId)

          // Обновляем заказ в списке
          set(state => ({
            orders: state.orders.map(o =>
              o.id === orderId ? order : o
            ),
            currentOrder: state.currentOrder?.id === orderId ? order : state.currentOrder,
            isLoading: false,
          }))
        } catch (error: any) {
          console.error('Error cancelling order:', error)

          set({
            isLoading: false,
            error: 'Ошибка отмены заказа',
          })
        }
      },

      loadDeliveryMethods: async () => {
        try {
          const methods = await orderService.getDeliveryMethods()
          const filtered = methods.filter((method) =>
            method.name?.toLowerCase().includes('yandex') || method.id === 'yandex'
          )
          set({ deliveryMethods: filtered.length ? filtered : defaultDeliveryMethods })
        } catch (error) {
          console.error('Error loading delivery methods:', error)
          set({ deliveryMethods: defaultDeliveryMethods })
        }
      },

      loadPaymentMethods: async () => {
        try {
          const methods = await orderService.getPaymentMethods()
          const filtered = methods.filter((method) => {
            const name = method.name?.toLowerCase() || '';
            return method.id === 'cash' || method.id === 'yookassa' || name.includes('налич') || name.includes('yookassa');
          })
          set({ paymentMethods: filtered.length ? filtered : defaultPaymentMethods })
        } catch (error) {
          console.error('Error loading payment methods:', error)
          set({ paymentMethods: defaultPaymentMethods })
        }
      },

      setShippingAddress: (address: ShippingAddress) => {
        set({ shippingAddress: address })
      },

      clearShippingAddress: () => {
        set({ shippingAddress: null })
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null })
      },

      clearError: () => {
        set({ error: null })
      },

      getUserOrders: () => {
        return get().orders
      },

      getOrderById: (id: string) => {
        const order = get().orders.find(order => order.id === id)
        if (order) return order
        const current = get().currentOrder
        return current && current.id === id ? current : undefined
      },

      getOrderByNumber: (orderNumber: string) => {
        return get().orders.find(order => order.id === orderNumber)
      },

      getOrdersByStatus: (status: Order['status']) => {
        return get().orders.filter(order => order.status === status)
      },

      getPendingOrders: () => {
        return get().orders.filter(order =>
          ['NEW', 'PAID', 'SHIPPED'].includes(order.status)
        )
      },

      getCompletedOrders: () => {
        return get().orders.filter(order =>
          ['COMPLETED', 'CANCELED'].includes(order.status)
        )
      },

      calculateOrderSummary: (items, deliveryMethod) => {
        const subtotal = items.reduce((sum, item) => sum + (item.pricePerItem * item.quantity), 0)
        const shipping = deliveryMethod?.price || 0
        const tax = subtotal * 0.2 // НДС 20%
        const total = subtotal + shipping + tax

        return {
          subtotal: Math.round(subtotal * 100) / 100,
          shipping: Math.round(shipping * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
        }
      },
    }),
    {
      name: 'order-storage',
      version: 2,
      partialize: (state) => ({
        orders: state.orders,
        deliveryMethods: state.deliveryMethods,
        paymentMethods: state.paymentMethods,
        shippingAddress: state.shippingAddress,
      }),
      migrate: (persisted) => {
        const state = persisted as OrderState;
        return {
          ...state,
          deliveryMethods: defaultDeliveryMethods,
          paymentMethods: defaultPaymentMethods,
        };
      },
    }
  )
)
