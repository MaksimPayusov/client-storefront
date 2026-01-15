/**
 * Сервис для работы с товарами
 */

import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

// Типы
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  sku: string;
  stockQuantity?: number;
  isActive: boolean;
  categoryId: string;
  brandId?: string;
  brandName?: string;
  shopId: string;
  images: string[];
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

type BackendProduct = {
  id: string;
  shopId: string;
  name: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  sku?: string | null;
  stockQuantity?: number | null;
  isActive?: boolean;
  categoryId?: string | null;
  brandId?: string | null;
  images?: string[] | null;
  imageUrls?: string[] | null;
  attributes?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string } | null;
  brand?: { id: string; name: string } | null;
};

const normalizeProductsPayload = (data: any): BackendProduct[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as BackendProduct[];
  if (data && Array.isArray(data.value)) return data.value as BackendProduct[];
  if (typeof data === 'object') return [data as BackendProduct];
  return [];
};

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  shopId: string;
  isActive: boolean;
  orderIndex: number;
  imageUrl?: string;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  shopId: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  size: Size;
  quantityAvailable: number;
}

export interface Size {
  id: string;
  value: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  sku: string;
  stockQuantity: number;
  categoryId: string;
  brandId?: string;
  shopId: string;
  images: string[];
  attributes?: Record<string, any>;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  oldPrice?: number;
  sku?: string;
  stockQuantity?: number;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  images?: string[];
  attributes?: Record<string, any>;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  shopId: string;
  imageUrl?: string;
  orderIndex?: number;
}

export interface CreateBrandRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  shopId: string;
}

class ProductService {
  // ========== ТОВАРЫ ==========

  /**
   * Получение справочника размеров
   */
  async getSizes(): Promise<Size[]> {
    const response = await apiClient.get<Size[]>(API_PATHS.SIZES);
    return response.data;
  }

  /**
   * Получение связок товар-размеры
   */
  async getProductSizesByProductId(productId: string): Promise<ProductSize[]> {
    const response = await apiClient.get<ProductSize[]>(
      buildPath(API_PATHS.PRODUCT_SIZES_BY_PRODUCT, { productId })
    );
    return response.data;
  }

  /**
   * Получение размерайки как список имён (S/M/L) для конкретного товара
   */
  async getSizeNamesForProduct(productId: string): Promise<string[]> {
    const productSizes = await this.getProductSizesByProductId(productId);
    const values = (productSizes || [])
      .map(ps => ps?.size?.value)
      .filter((v): v is string => Boolean(v));

    // unique, stable order
    return Array.from(new Set(values));
  }

  /**
   * Получение товаров с фильтрацией
   */
  async getProducts(params?: {
    shopId?: string;
    categoryId?: string;
    brandId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      API_PATHS.PRODUCTS,
      { params }
    );
    return response.data;
  }

  /**
   * Получение товара по ID
   */
  async getProductById(productId: string): Promise<Product> {
    const response = await apiClient.get<Product>(
      buildPath(API_PATHS.PRODUCT_BY_ID, { id: productId })
    );
    return response.data;
  }

  /**
   * Получение товаров магазина
   */
  async getProductsByShop(shopId: string): Promise<Product[]> {
    const response = await apiClient.get<any>(
      buildPath(API_PATHS.PRODUCTS_BY_SHOP, { shopId })
    );

    const items = normalizeProductsPayload(response.data);

    return items.map((p) => {
      const images = (p.images ?? p.imageUrls ?? [])?.filter(Boolean) as string[];
      const createdAt = p.createdAt || new Date().toISOString();
      const updatedAt = p.updatedAt || createdAt;

      return {
        id: p.id,
        shopId: p.shopId,
        name: p.name,
        description: (p.description ?? '') as string,
        price: p.price,
        oldPrice: (p.oldPrice ?? undefined) as number | undefined,
        sku: (p.sku ?? `SKU${p.id}`) as string,
        stockQuantity: (p.stockQuantity ?? undefined) as number | undefined,
        isActive: p.isActive ?? true,
        categoryId: (p.categoryId ?? p.category?.id ?? '') as string,
        brandId: (p.brandId ?? p.brand?.id ?? undefined) as string | undefined,
        brandName: (p.brand?.name ?? undefined) as string | undefined,
        images,
        attributes: (p.attributes ?? {}) as Record<string, any>,
        createdAt,
        updatedAt,
      };
    });
  }

  /**
   * Создание товара
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<Product>(
      API_PATHS.PRODUCTS,
      data
    );
    return response.data;
  }

  /**
   * Обновление товара
   */
  async updateProduct(productId: string, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<Product>(
      buildPath(API_PATHS.PRODUCT_BY_ID, { id: productId }),
      data
    );
    return response.data;
  }

  /**
   * Удаление товара
   */
  async deleteProduct(productId: string): Promise<void> {
    await apiClient.delete(
      buildPath(API_PATHS.PRODUCT_BY_ID, { id: productId })
    );
  }

  /**
   * Поиск товаров
   */
  async searchProducts(query: string, shopId?: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      API_PATHS.PRODUCTS_SEARCH,
      { params: { query, shopId } }
    );
    return response.data;
  }

  // ========== КАТЕГОРИИ ==========

  /**
   * Получение категорий
   */
  async getCategories(params?: {
    shopId?: string;
    parentId?: string;
    activeOnly?: boolean;
  }): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      API_PATHS.CATEGORIES,
      { params }
    );
    return response.data;
  }

  /**
   * Получение категорий магазина
   */
  async getCategoriesByShop(shopId: string): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      buildPath(API_PATHS.CATEGORIES_BY_SHOP, { shopId })
    );
    return response.data;
  }

  /**
   * Создание категории
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<Category>(
      API_PATHS.CATEGORIES,
      data
    );
    return response.data;
  }

  /**
   * Получение дерева категорий
   */
  async getCategoryTree(shopId: string): Promise<Category[]> {
    const categories = await this.getCategoriesByShop(shopId);
    return this.buildCategoryTree(categories);
  }

  /**
   * Построение дерева категорий
   */
  private buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>();
    const tree: Category[] = [];

    // Создаём карту категорий
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Строим дерево
    categories.forEach(category => {
      const node = categoryMap.get(category.id)!;
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        parent.children!.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  }

  // ========== БРЕНДЫ ==========

  /**
   * Получение брендов
   */
  async getBrands(params?: {
    shopId?: string;
    activeOnly?: boolean;
  }): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>(
      API_PATHS.BRANDS,
      { params }
    );
    return response.data;
  }

  /**
   * Получение брендов магазина
   */
  async getBrandsByShop(shopId: string): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>(
      buildPath(API_PATHS.BRANDS_BY_SHOP, { shopId })
    );
    return response.data;
  }

  /**
   * Создание бренда
   */
  async createBrand(data: CreateBrandRequest): Promise<Brand> {
    const response = await apiClient.post<Brand>(
      API_PATHS.BRANDS,
      data
    );
    return response.data;
  }

  /**
   * Получение популярных товаров
   */
  async getPopularProducts(shopId: string, limit: number = 10): Promise<Product[]> {
    const products = await this.getProductsByShop(shopId);
    return products
      .filter(p => p.isActive)
      .sort((a, b) => (b.price - a.price)) // Пример сортировки по цене
      .slice(0, limit);
  }

  /**
   * Получение товаров по категории (с дочерними категориями)
   */
  async getProductsByCategory(categoryId: string, shopId: string): Promise<Product[]> {
    const categories = await this.getCategoryTree(shopId);
    const categoryIds = this.getCategoryIdsRecursive(categories, categoryId);

    const products = await this.getProductsByShop(shopId);
    return products.filter(p =>
      p.isActive && categoryIds.includes(p.categoryId)
    );
  }

  private getCategoryIdsRecursive(categories: Category[], parentId: string): string[] {
    const ids: string[] = [parentId];

    const findCategory = (cats: Category[], id: string): Category | undefined => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children && cat.children.length > 0) {
          const found = findCategory(cat.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const category = findCategory(categories, parentId);
    if (category && category.children) {
      category.children.forEach(child => {
        ids.push(...this.getCategoryIdsRecursive(categories, child.id));
      });
    }

    return ids;
  }
}

// Создаём и экспортируем singleton экземпляр
export const productService = new ProductService();
export default productService;
