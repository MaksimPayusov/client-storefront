import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IGood } from '@/types'

export interface DeliveryMethod {
  id: number
  title: string
  description: string
  price: number
  estimatedDays: number
}

export interface PaymentMethod {
  id: number
  title: string
  description: string
}

export interface OrderItem {
  productId: IGood['id']
  quantity: number
  price: number
  name: string
  image?: string
  size?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  recipient: {
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    comment?: string
  }
  delivery: DeliveryMethod
  payment: PaymentMethod
  subtotal: number
  deliveryPrice: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  orderNumber: string
}

interface OrderState {
  orders: Order[]
  deliveryMethods: DeliveryMethod[]
  paymentMethods: PaymentMethod[]

  // Actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'orderNumber' | 'status'>) => Order
  getOrderById: (id: string) => Order | undefined
  getUserOrders: () => Order[]
  clearOrders: () => void
}

// Моковые методы доставки
const mockDeliveryMethods: DeliveryMethod[] = [
  {
    id: 1,
    title: 'Самовывоз из магазина',
    description: 'Бесплатно, завтра',
    price: 0,
    estimatedDays: 1,
  },
  {
    id: 2,
    title: 'Курьерская доставка по городу',
    description: 'Доставка на следующий день',
    price: 299,
    estimatedDays: 1,
  },
  {
    id: 3,
    title: 'Доставка по России',
    description: '3-7 дней',
    price: 499,
    estimatedDays: 5,
  },
]

// Моковые методы оплаты
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    title: 'Наличные при получении',
    description: 'Оплата курьеру наличными',
  },
  {
    id: 2,
    title: 'Банковская карта онлайн',
    description: 'Безопасная оплата картой',
  },
]

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      deliveryMethods: mockDeliveryMethods,
      paymentMethods: mockPaymentMethods,

      createOrder: (orderData) => {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

        const newOrder: Order = {
          ...orderData,
          id: orderId,
          orderNumber,
          status: 'pending',
          createdAt: new Date(),
        }

        set((state) => ({
          orders: [newOrder, ...state.orders]
        }))

        return newOrder
      },

      getOrderById: (id) => {
        return get().orders.find(order => order.id === id)
      },

      getUserOrders: () => {
        return get().orders
      },

      clearOrders: () => {
        set({ orders: [] })
      }
    }),
    {
      name: 'orders-storage',
    }
  )
)