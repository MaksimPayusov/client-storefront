// API client for products, categories, brands

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  brandId?: string;
  imageUrls?: string[];
  isActive?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  shopId?: string;
  title: string;
  parentId?: string;
}

export interface Brand {
  id: string;
  shopId?: string;
  name: string;
  logoUrl?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const productsApi = {
  // Get products by shop ID
  getByShopId: async (shopId: string) => {
    const res = await fetch(`${API_URL}/api/products?shopId=${shopId}`, {
      next: { revalidate: 60 }, // ISR: кэшировать на 60 секунд
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await res.json();
    return { data: data as Product[] };
  },
  
  // Get product by ID
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error('Product not found');
    }
    
    return res.json() as Promise<Product>;
  },
};

export const categoriesApi = {
  // Get categories by shop ID
  getByShopId: async (shopId: string) => {
    const res = await fetch(`${API_URL}/api/categories/shop/${shopId}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await res.json();
    return { data: data as Category[] };
  },
  
  // Get category by ID
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error('Category not found');
    }
    
    return res.json() as Promise<Category>;
  },
};

export const brandsApi = {
  // Get brands by shop ID
  getByShopId: async (shopId: string) => {
    const res = await fetch(`${API_URL}/api/brands/shop/${shopId}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch brands');
    }
    
    const data = await res.json();
    return { data: data as Brand[] };
  },
  
  // Get brand by ID
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/api/brands/${id}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error('Brand not found');
    }
    
    return res.json() as Promise<Brand>;
  },
};
