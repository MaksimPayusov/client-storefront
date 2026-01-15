/**
 * Сервис для работы с новостями
 */

import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

// Типы
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  tags: string[];
  shopId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author: string;
  isPublished?: boolean;
  tags?: string[];
  shopId?: string;
}

export interface UpdateNewsRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  isPublished?: boolean;
  views?: number;
  tags?: string[];
}

class NewsService {
  /**
   * Получение списка новостей
   */
  async getNews(params?: {
    shopId?: string;
    publishedOnly?: boolean;
    page?: number;
    size?: number;
    tag?: string;
    search?: string;
  }): Promise<NewsItem[]> {
    const response = await apiClient.get<any>(
      API_PATHS.NEWS,
      { params }
    );

    const data = response.data;
    if (Array.isArray(data)) return data as NewsItem[];
    if (data && Array.isArray(data.content)) return data.content as NewsItem[];
    return [];
  }

  /**
   * Получение новости по slug
   */
  async getNewsBySlug(slug: string): Promise<NewsItem> {
    const response = await apiClient.get<NewsItem>(
      buildPath(API_PATHS.NEWS_BY_SLUG, { slug })
    );
    return response.data;
  }

  /**
   * Получение новости по ID
   */
  async getNewsById(id: string): Promise<NewsItem> {
    const newsItems = await this.getAllNews();
    const news = newsItems.find(item => item.id === id);

    if (!news) {
      throw new Error('Новость не найдена');
    }

    return news;
  }

  /**
   * Получение всех новостей (включая неопубликованные)
   */
  async getAllNews(): Promise<NewsItem[]> {
    try {
      const response = await apiClient.get<NewsItem[]>(
        API_PATHS.NEWS_ADMIN_ALL
      );
      return response.data;
    } catch (error) {
      // Если нет прав, возвращаем только опубликованные
      return this.getNews({ publishedOnly: true });
    }
  }

  /**
   * Создание новости
   */
  async createNews(data: CreateNewsRequest): Promise<NewsItem> {
    // Генерация slug из заголовка
    const slug = this.generateSlug(data.title);

    const response = await apiClient.post<NewsItem>(
      API_PATHS.NEWS,
      {
        ...data,
        slug,
      }
    );
    return response.data;
  }

  /**
   * Обновление новости
   */
  async updateNews(id: string, data: UpdateNewsRequest): Promise<NewsItem> {
    const response = await apiClient.put<NewsItem>(
      buildPath(API_PATHS.NEWS_BY_SLUG, { slug: id }),
      data
    );
    return response.data;
  }

  /**
   * Удаление новости
   */
  async deleteNews(id: string): Promise<void> {
    await apiClient.delete(
      buildPath(API_PATHS.NEWS_BY_SLUG, { slug: id })
    );
  }

  /**
   * Получение популярных новостей
   */
  async getPopularNews(limit: number = 5): Promise<NewsItem[]> {
    const news = await this.getNews({ publishedOnly: true });
    return news
      .filter(item => item.isPublished)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * Получение последних новостей
   */
  async getLatestNews(limit: number = 5): Promise<NewsItem[]> {
    const news = await this.getNews({ publishedOnly: true });
    return news
      .filter(item => item.isPublished)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Получение новостей по тегу
   */
  async getNewsByTag(tag: string): Promise<NewsItem[]> {
    const news = await this.getNews({ publishedOnly: true });
    return news.filter(item =>
      item.isPublished && item.tags.includes(tag)
    );
  }

  /**
   * Увеличение счетчика просмотров
   */
  async incrementViews(slug: string): Promise<void> {
    try {
      const news = await this.getNewsBySlug(slug);
      await this.updateNews(news.id, {
        views: news.views + 1,
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  /**
   * Генерация slug из заголовка
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/--+/g, '-') // Удаляем двойные дефисы
      .trim();
  }

  /**
   * Поиск новостей
   */
  async searchNews(query: string): Promise<NewsItem[]> {
    const news = await this.getNews({ publishedOnly: true });
    const lowerQuery = query.toLowerCase();

    return news.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.excerpt?.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Получение всех тегов
   */
  async getAllTags(): Promise<string[]> {
    const news = await this.getNews({ publishedOnly: true });
    const tags = new Set<string>();

    news.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });

    return Array.from(tags);
  }
}

// Создаём и экспортируем singleton экземпляр
export const newsService = new NewsService();
export default newsService;
