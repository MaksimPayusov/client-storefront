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
import { parseDesignCode } from '@/api/shops.api'
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
  getCategoryById: (id: string) => IGoodCategory | undefined
  getGoodById: (id: string) => IGood | undefined

  // Методы для работы с деревом категорий
  getCategoryTree: () => IGoodCategory[]
  findCategory: (id: string) => IGoodCategory | undefined
  getCategoryPath: (categoryId: string) => IGoodCategory[]
  getChildCategories: (parentId: string | null) => IGoodCategory[]
  getGoodsByCategory: (categoryId: string, includeChildren?: boolean) => IGood[]
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
          let domain = shopUrl || shopService.getShopDomainFromUrl()

          // На localhost при первом заходе без cookie/query домен может быть 'default'.
          // В этом случае авто-выбираем самый свежий активный магазин.
          if (typeof window !== 'undefined' && domain === 'default') {
            try {
              const shops = await shopService.getAllShops()
              const active = (shops || [])
                .filter((s: any) => s && (s.isActive !== false))
                .sort((a: any, b: any) => {
                  const aTime = new Date(a.createdAt || 0).getTime()
                  const bTime = new Date(b.createdAt || 0).getTime()
                  return bTime - aTime
                })

              const picked = active[0]
              const pickedDomain = picked?.domain || picked?.url
              if (pickedDomain) {
                document.cookie = `shop=${encodeURIComponent(pickedDomain)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
                domain = pickedDomain
              }
            } catch {
              // ignore
            }
          }

          // Загружаем магазин с сервера
          const shopData = await shopService.getShopByUrl(domain)

          const designCode = (shopData as any).designCode as string | undefined
          if (designCode) {
            const parsed = parseDesignCode(designCode)
            const themeName = parsed?.theme as ThemeName | undefined
            if (themeName) {
              get().setThemeByName(themeName)
            }
          }

          const shop: IShop = {
            id: shopData.id,
            name: shopData.name,
            description: shopData.description,
            domain: shopData.domain,
            logoUrl: shopData.logoUrl || '',
            bannerUrl: shopData.bannerUrl || '',
            createdAt: new Date(shopData.createdAt),
            updatedAt: new Date(shopData.updatedAt),
            isActive: shopData.isActive,
            categories: [],
            brands: [],
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

          set({
            shop: null,
            categories: [],
            goods: [],
            brands: [],
            news: [],
            isLoading: false,
            error: 'Не удалось загрузить магазин',
          })
        }
      },

      loadCategories: async (shopId: string) => {
        try {
          const categoriesData = await productService.getCategoriesByShop(shopId)

          const categories: IGoodCategory[] = categoriesData.map(cat => ({
            id: cat.id,
            name: (cat.name || (cat as any).title || '') as string,
            description: (cat.description || '') as string,
            parentId: (cat.parentId || (cat as any).parentId || null) as any,
            shopId: cat.shopId,
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

          const pickSizesFromAttributes = (attributes: any): string[] | undefined => {
            if (!attributes) return undefined
            const raw = attributes.sizes ?? attributes.size
            if (!raw) return undefined
            if (Array.isArray(raw)) {
              const arr = raw.filter(Boolean).map(String)
              return arr.length > 0 ? arr : undefined
            }
            if (typeof raw === 'string') {
              const parts = raw
                .split(/[;,]/g)
                .map((s: string) => s.trim())
                .filter(Boolean)
              return parts.length > 0 ? parts : undefined
            }
            return undefined
          }

          const goods: IGood[] = productsData.map(product => ({
            id: product.id,
            shopId: product.shopId,
            name: product.name,
            description: product.description,
            price: product.price,
            oldPrice: product.oldPrice,
            images: product.images || [],
            image: (product.images && product.images.length > 0) ? product.images[0] : undefined,
            categoryId: product.categoryId,
            brandId: product.brandId || undefined,
            brand: (product as any).brandName || undefined,
            sku: product.sku,
            stockQuantity: product.stockQuantity,
            sizes: pickSizesFromAttributes(product.attributes),
            inStock:
              product.isActive !== false &&
              (typeof product.stockQuantity === 'number' ? product.stockQuantity > 0 : true),
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
            id: brand.id,
            name: brand.name,
            description: brand.description || '',
            logoUrl: brand.logoUrl || '',
            shopId: brand.shopId,
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
            id: item.id,
            title: item.title,
            content: item.content,
            excerpt: item.excerpt || '',
            imageUrl: (item.imageUrl || (item as any).previewImageUrl || '') as string,
            image: ((item.imageUrl || (item as any).previewImageUrl) ?? undefined) as any,
            author: item.author,
            isPublished: item.isPublished,
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
            views: item.views,
            tags: item.tags,
            shopId: item.shopId || undefined,
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
        return get().categories.find((cat) => cat.id === id)
      },

      getGoodById: (id) => {
        return get().goods.find((good) => good.id === id)
      },

      // Методы для работы с деревом категорий
      getCategoryTree: () => buildCategoryTree(get().categories),

      findCategory: (id) => {
        return findCategoryInTree(buildCategoryTree(get().categories), id)
      },

      getCategoryPath: (categoryId) => {
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
      version: 2,
      migrate: (persistedState: any) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState

        const nextState = { ...persistedState }

        // Нормализация домена магазина из старых версий
        if (nextState.shop && typeof nextState.shop === 'object') {
          const shop = { ...nextState.shop }

          // legacy: domain could be stored with separators (e.g. dash), normalize it
          if (typeof shop.domain === 'string') {
            const normalized = shop.domain.replace(/[^a-z0-9]/gi, '')
            if (normalized === 'fashionstore') {
              shop.domain = 'fashionstore'
            }
          }

          // legacy: some older shapes may keep url/shopUrl instead of domain
          if (!shop.domain && shop.shopUrl) {
            shop.domain = shop.shopUrl
          }
          if (!shop.name && shop.shopName) {
            shop.name = shop.shopName
          }

          nextState.shop = shop
        }

        return nextState
      },
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
