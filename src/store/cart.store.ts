import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IGood } from '@/types'
import { cartService } from '@/services/cart.service'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  imageUrl?: string
  maxQuantity: number
  addedAt: Date
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalAmount: number
  isLoading: boolean
  error: string | null
  lastSync: Date | null

  // Actions
  loadCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncWithServer: () => Promise<void>
  getItemQuantity: (productId: string) => number
  isInCart: (productId: string) => boolean
  calculateTotals: () => void
  clearError: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
      isLoading: false,
      error: null,
      lastSync: null,

      loadCart: async () => {
        set({ isLoading: true, error: null })

        try {
          const cart = await cartService.getCart()

          const items: CartItem[] = cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl,
            maxQuantity: item.maxQuantity,
            addedAt: new Date(),
          }))

          set({
            items,
            totalQuantity: cart.totalItems,
            totalAmount: cart.totalAmount,
            isLoading: false,
            lastSync: new Date(),
          })

        } catch (error: any) {
          console.error('Error loading cart:', error)

          set({
            isLoading: false,
            error: 'Ошибка загрузки корзины',
          })
        }
      },

      addToCart: async (productId, quantity = 1, size, color) => {
        set({ isLoading: true, error: null })

        try {
          const cart = await cartService.addItem({
            productId,
            quantity,
            size,
            color,
          })

          const items: CartItem[] = cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl,
            maxQuantity: item.maxQuantity,
            addedAt: new Date(),
          }))

          set({
            items,
            totalQuantity: cart.totalItems,
            totalAmount: cart.totalAmount,
            isLoading: false,
            lastSync: new Date(),
          })

        } catch (error: any) {
          console.error('Error adding to cart:', error)

          let errorMessage = 'Ошибка добавления в корзину'
          if (error.response?.status === 400) {
            errorMessage = 'Неверные данные товара'
          } else if (error.response?.status === 404) {
            errorMessage = 'Товар не найден'
          }

          set({
            isLoading: false,
            error: errorMessage,
          })

          throw new Error(errorMessage)
        }
      },

      removeFromCart: async (productId) => {
        set({ isLoading: true, error: null })

        try {
          const cart = await cartService.removeItem(productId)

          const items: CartItem[] = cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl,
            maxQuantity: item.maxQuantity,
            addedAt: new Date(),
          }))

          set({
            items,
            totalQuantity: cart.totalItems,
            totalAmount: cart.totalAmount,
            isLoading: false,
            lastSync: new Date(),
          })

        } catch (error: any) {
          console.error('Error removing from cart:', error)

          set({
            isLoading: false,
            error: 'Ошибка удаления из корзины',
          })
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) {
          await get().removeFromCart(productId)
          return
        }

        set({ isLoading: true, error: null })

        try {
          const cart = await cartService.updateQuantity(productId, quantity)

          const items: CartItem[] = cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            imageUrl: item.imageUrl,
            maxQuantity: item.maxQuantity,
            addedAt: new Date(),
          }))

          set({
            items,
            totalQuantity: cart.totalItems,
            totalAmount: cart.totalAmount,
            isLoading: false,
            lastSync: new Date(),
          })

        } catch (error: any) {
          console.error('Error updating quantity:', error)

          set({
            isLoading: false,
            error: 'Ошибка обновления количества',
          })
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null })

        try {
          await cartService.clearCart()

          set({
            items: [],
            totalQuantity: 0,
            totalAmount: 0,
            isLoading: false,
            lastSync: new Date(),
          })

        } catch (error: any) {
          console.error('Error clearing cart:', error)

          set({
            isLoading: false,
            error: 'Ошибка очистки корзины',
          })
        }
      },

      syncWithServer: async () => {
        try {
          await get().loadCart()
        } catch (error) {
          console.error('Error syncing cart:', error)
        }
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
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ totalQuantity, totalAmount })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalAmount: state.totalAmount,
        lastSync: state.lastSync,
      }),
    }
  )
)