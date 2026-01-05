import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IGood } from '@/types'

interface FavoritesState {
  items: IGood['id'][]

  // Actions
  addToFavorites: (productId: IGood['id']) => void
  removeFromFavorites: (productId: IGood['id']) => void
  toggleFavorite: (productId: IGood['id']) => void
  isInFavorites: (productId: IGood['id']) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addToFavorites: (productId) => {
        set((state) => ({
          items: [...state.items, productId]
        }))
      },

      removeFromFavorites: (productId) => {
        set((state) => ({
          items: state.items.filter(id => id !== productId)
        }))
      },

      toggleFavorite: (productId) => {
        const { items, addToFavorites, removeFromFavorites } = get()
        if (items.includes(productId)) {
          removeFromFavorites(productId)
        } else {
          addToFavorites(productId)
        }
      },

      isInFavorites: (productId) => {
        return get().items.includes(productId)
      },

      clearFavorites: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
)