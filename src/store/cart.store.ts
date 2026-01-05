import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IGood } from '@/types'

export interface CartItem {
  productId: IGood['id']
  quantity: number
  size?: string
  addedAt: Date
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number

  // Actions
  addToCart: (productId: IGood['id'], quantity?: number, size?: string) => void
  removeFromCart: (productId: IGood['id']) => void
  updateQuantity: (productId: IGood['id'], quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: IGood['id']) => number
  isInCart: (productId: IGood['id']) => boolean
  calculateTotals: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,

      addToCart: (productId, quantity = 1, size) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.productId === productId
          )

          let newItems: CartItem[]

          if (existingItemIndex >= 0) {
            // Увеличиваем количество существующего товара
            newItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    size: size || item.size,
                    addedAt: new Date()
                  }
                : item
            )
          } else {
            // Добавляем новый товар
            newItems = [
              ...state.items,
              {
                productId,
                quantity,
                size,
                addedAt: new Date()
              }
            ]
          }

          // Рассчитываем новые итоги
          const newTotalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const newTotalAmount = newItems.length // В реальности нужно считать по ценам товаров

          return {
            items: newItems,
            totalQuantity: newTotalQuantity,
            totalAmount: newTotalAmount
          }
        })
      },

      removeFromCart: (productId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.productId !== productId)
          const newTotalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const newTotalAmount = newItems.length

          return {
            items: newItems,
            totalQuantity: newTotalQuantity,
            totalAmount: newTotalAmount
          }
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(productId)
          return
        }

        set((state) => {
          const newItems = state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity, addedAt: new Date() }
              : item
          )

          const newTotalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0)
          const newTotalAmount = newItems.length

          return {
            items: newItems,
            totalQuantity: newTotalQuantity,
            totalAmount: newTotalAmount
          }
        })
      },

      clearCart: () => {
        set({ items: [], totalQuantity: 0, totalAmount: 0 })
      },

      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.productId === productId)
        return item ? item.quantity : 0
      },

      isInCart: (productId) => {
        return get().items.some(item => item.productId === productId)
      },

      calculateTotals: () => {
        const { items } = get()
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = items.length // В реальности нужно считать сумму

        set({ totalQuantity, totalAmount })
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)