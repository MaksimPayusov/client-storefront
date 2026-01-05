// хранилище Zustand для данных магазина

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IShop, IGood, IGoodCategory, IBrand, INews } from '@/types'
import {
  buildCategoryTree,
  findCategoryInTree,
  getCategoryPath,
  getGoodsInCategoryAndChildren
} from '@/lib/category-utils'
import { getThemeByName, type ThemeName } from '@/lib/theme-utils'

// Начальные данные
import {
  mockShop,
  mockGoods,
  mockCategories,
  mockBrands,
  mockNews,
} from '@/lib/mock-data'

// Дефолтная тема
const defaultTheme = getThemeByName('Минимализм') // Или 'Классика Dark' по желанию

interface ShopState {
  // Основные данные магазина
  shop: IShop

  // Контент магазина
  categories: IGoodCategory[]
  goods: IGood[]
  brands: IBrand[]
  news: INews[]

  // Тема магазина
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
    buttonBg: string
    buttonText: string
  }
  themeName: ThemeName // Добавляем имя темы для отображения

  // Основные действия
  setShop: (shop: IShop) => void
  setCategories: (categories: IGoodCategory[]) => void
  setGoods: (goods: IGood[]) => void
  setBrands: (brands: IBrand[]) => void
  setNews: (news: INews[]) => void
  setTheme: (theme: Partial<ShopState['theme']>) => void
  setThemeByName: (themeName: ThemeName) => void // Новая функция

  // Вспомогательные геттеры
  getCategoryById: (id: number) => IGoodCategory | undefined
  getGoodById: (id: number | string) => IGood | undefined

  // Методы для работы с деревом категорий
  getCategoryTree: () => IGoodCategory[]
  findCategory: (id: number) => IGoodCategory | undefined
  getCategoryPath: (categoryId: number) => IGoodCategory[]
  getChildCategories: (parentId: number | null) => IGoodCategory[]
  getGoodsByCategory: (categoryId: number, includeChildren?: boolean) => IGood[]
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      shop: mockShop,
      categories: mockCategories,
      goods: mockGoods,
      brands: mockBrands,
      news: mockNews,
      theme: defaultTheme,
      themeName: 'Минимализм',

      // Основные действия
      setShop: (shop) => set({ shop }),
      setCategories: (categories) => set({ categories }),
      setGoods: (goods) => set({ goods }),
      setBrands: (brands) => set({ brands }),
      setNews: (news) => set({ news }),
      setTheme: (newTheme) =>
        set((state) => ({
          theme: { ...state.theme, ...newTheme },
        })),
      setThemeByName: (themeName) => {
        const theme = getThemeByName(themeName)
        set({
          theme,
          themeName
        })
      },

      // Вспомогательные геттеры
      getCategoryById: (id) =>
        get().categories.find((cat) => cat.id === id),

      getGoodById: (id) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id
        return get().goods.find((good) => good.id === numId)
      },

      // Методы для работы с деревом категорий
      getCategoryTree: () => buildCategoryTree(get().categories),

      findCategory: (id) => findCategoryInTree(buildCategoryTree(get().categories), id),

      getCategoryPath: (categoryId: number) => {
        const categories = get().categories;
        const tree = buildCategoryTree(categories);
        return getCategoryPath(tree, categoryId, categories);
      },

      getChildCategories: (parentId) => {
        const tree = buildCategoryTree(get().categories)
        if (parentId === null) {
          return tree.filter(cat => cat.parentId === null)
        }
        const parent = findCategoryInTree(tree, parentId)
        return parent?.children || []
      },

      getGoodsByCategory: (categoryId, includeChildren = false) => {
        if (includeChildren) {
          return getGoodsInCategoryAndChildren(get().goods, get().categories, categoryId)
        }
        return get().goods.filter(good => good.categoryId === categoryId)
      },
    }),
    {
      name: 'shop-storage',
      partialize: (state) => ({
        shop: state.shop,
        categories: state.categories,
        goods: state.goods,
        brands: state.brands,
        news: state.news,
        theme: state.theme,
        themeName: state.themeName,
      }),
    }
  )
)