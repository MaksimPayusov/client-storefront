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
  stockQuantity: number;
  isActive: boolean;
  categoryId: string;
  brandId?: string;
  shopId: string;
  images: string[];
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

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
  sizeId: string;
  stockQuantity: number;
}

export interface Size {
  id: string;
  name: string;
  description?: string;
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
    const response = await apiClient.get<Product[]>(
      buildPath(API_PATHS.PRODUCTS_BY_SHOP, { shopId })
    );
    return response.data;
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