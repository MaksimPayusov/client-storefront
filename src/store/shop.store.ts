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
import { shopService } from '@/services/shop.service'
import { productService } from '@/services/products.service'
import { newsService } from '@/services/news.service'

interface ShopState {
  // Основные данные магазина
  shop: IShop | null
  isLoading: boolean
  error: string | null

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
  themeName: ThemeName

  // Основные действия
  loadShop: (shopUrl?: string) => Promise<void>
  loadCategories: (shopId: string) => Promise<void>
  loadProducts: (shopId: string) => Promise<void>
  loadBrands: (shopId: string) => Promise<void>
  loadNews: (shopId?: string) => Promise<void>
  setShop: (shop: IShop) => void
  setCategories: (categories: IGoodCategory[]) => void
  setGoods: (goods: IGood[]) => void
  setBrands: (brands: IBrand[]) => void
  setNews: (news: INews[]) => void
  setTheme: (theme: Partial<ShopState['theme']>) => void
  setThemeByName: (themeName: ThemeName) => void
  clearError: () => void

  // Вспомогательные геттеры
  getCategoryById: (id: number | string) => IGoodCategory | undefined
  getGoodById: (id: number | string) => IGood | undefined

  // Методы для работы с деревом категорий
  getCategoryTree: () => IGoodCategory[]
  findCategory: (id: number | string) => IGoodCategory | undefined
  getCategoryPath: (categoryId: number | string) => IGoodCategory[]
  getChildCategories: (parentId: number | string | null) => IGoodCategory[]
  getGoodsByCategory: (categoryId: number | string, includeChildren?: boolean) => IGood[]
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      shop: null,
      isLoading: false,
      error: null,
      categories: [],
      goods: [],
      brands: [],
      news: [],
      theme: getThemeByName('Минимализм'),
      themeName: 'Минимализм',

      // Основные действия
      loadShop: async (shopUrl?: string) => {
        set({ isLoading: true, error: null })

        try {
          // Определяем домен магазина
          const domain = shopUrl || shopService.getShopDomainFromUrl()

          // Загружаем магазин с сервера
          const shopData = await shopService.getShopByUrl(domain)

          const shop: IShop = {
            id: parseInt(shopData.id) || Date.now(),
            name: shopData.name,
            description: shopData.description,
            domain: shopData.domain,
            logoUrl: shopData.logoUrl || '',
            bannerUrl: shopData.bannerUrl || '',
            createdAt: new Date(shopData.createdAt),
            updatedAt: new Date(shopData.updatedAt),
            isActive: shopData.isActive,
          }

          set({
            shop,
            isLoading: false,
            error: null
          })

          // Загружаем остальные данные магазина
          await Promise.all([
            get().loadCategories(shopData.id),
            get().loadProducts(shopData.id),
            get().loadBrands(shopData.id),
            get().loadNews(shopData.id),
          ])

        } catch (error: any) {
          console.error('Error loading shop:', error)

          let errorMessage = 'Ошибка загрузки магазина'
          if (error.response?.status === 404) {
            errorMessage = 'Магазин не найден'
          } else if (error.message) {
            errorMessage = error.message
          }

          set({
            isLoading: false,
            error: errorMessage
          })
        }
      },

      loadCategories: async (shopId: string) => {
        try {
          const categoriesData = await productService.getCategoriesByShop(shopId)

          const categories: IGoodCategory[] = categoriesData.map(cat => ({
            id: parseInt(cat.id) || Date.now(),
            name: cat.name,
            description: cat.description || '',
            parentId: cat.parentId ? parseInt(cat.parentId) : null,
            shopId: parseInt(cat.shopId) || 1,
            imageUrl: cat.imageUrl || '',
            isActive: cat.isActive,
          }))

          set({ categories })
        } catch (error) {
          console.error('Error loading categories:', error)
          // Оставляем пустой массив при ошибке
          set({ categories: [] })
        }
      },

      loadProducts: async (shopId: string) => {
        try {
          const productsData = await productService.getProductsByShop(shopId)

          const goods: IGood[] = productsData.map(product => ({
            id: parseInt(product.id) || Date.now(),
            name: product.name,
            description: product.description,
            price: product.price,
            oldPrice: product.oldPrice,
            images: product.images || [],
            categoryId: parseInt(product.categoryId) || 1,
            brandId: product.brandId ? parseInt(product.brandId) : undefined,
            sku: product.sku,
            stockQuantity: product.stockQuantity,
            isActive: product.isActive,
            attributes: product.attributes || {},
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
          }))

          set({ goods })
        } catch (error) {
          console.error('Error loading products:', error)
          // Оставляем пустой массив при ошибке
          set({ goods: [] })
        }
      },

      loadBrands: async (shopId: string) => {
        try {
          const brandsData = await productService.getBrandsByShop(shopId)

          const brands: IBrand[] = brandsData.map(brand => ({
            id: parseInt(brand.id) || Date.now(),
            name: brand.name,
            description: brand.description || '',
            logoUrl: brand.logoUrl || '',
            shopId: parseInt(brand.shopId) || 1,
            isActive: brand.isActive,
          }))

          set({ brands })
        } catch (error) {
          console.error('Error loading brands:', error)
          // Оставляем пустой массив при ошибке
          set({ brands: [] })
        }
      },

      loadNews: async (shopId?: string) => {
        try {
          const params = shopId ? { shopId } : {}
          const newsData = await newsService.getNews(params)

          const news: INews[] = newsData.map(item => ({
            id: parseInt(item.id) || Date.now(),
            title: item.title,
            content: item.content,
            excerpt: item.excerpt || '',
            imageUrl: item.imageUrl || '',
            author: item.author,
            isPublished: item.isPublished,
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
            views: item.views,
            tags: item.tags,
            shopId: item.shopId ? parseInt(item.shopId) : undefined,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          }))

          set({ news })
        } catch (error) {
          console.error('Error loading news:', error)
          // Оставляем пустой массив при ошибке
          set({ news: [] })
        }
      },

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

      clearError: () => set({ error: null }),

      // Вспомогательные геттеры
      getCategoryById: (id) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id
        return get().categories.find((cat) => cat.id === numId)
      },

      getGoodById: (id) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id
        return get().goods.find((good) => good.id === numId)
      },

      // Методы для работы с деревом категорий
      getCategoryTree: () => buildCategoryTree(get().categories),

      findCategory: (id) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id
        return findCategoryInTree(buildCategoryTree(get().categories), numId)
      },

      getCategoryPath: (categoryId) => {
        const categories = get().categories;
        const tree = buildCategoryTree(categories);
        const numId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId
        return getCategoryPath(tree, numId, categories);
      },

      getChildCategories: (parentId) => {
        const tree = buildCategoryTree(get().categories)
        if (parentId === null) {
          return tree.filter(cat => cat.parentId === null)
        }

        const numId = typeof parentId === 'string' ? parseInt(parentId, 10) : parentId
        const parent = findCategoryInTree(tree, numId)
        return parent?.children || []
      },

      getGoodsByCategory: (categoryId, includeChildren = false) => {
        const numId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId

        if (includeChildren) {
          return getGoodsInCategoryAndChildren(get().goods, get().categories, numId)
        }
        return get().goods.filter(good => good.categoryId === numId)
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