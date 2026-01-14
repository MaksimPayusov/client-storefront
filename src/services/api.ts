/**
 * Базовый HTTP клиент с настройками авторизации
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_PATHS } from '@/constants/api.endpoints';

// Типы для токена
interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor для добавления токена
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor для обновления токена при 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Очищаем токены при ошибке обновления
            this.clearTokens();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Получение токена из localStorage
  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    const tokenData = localStorage.getItem('token_data');
    if (!tokenData) return null;

    try {
      const parsed: TokenData = JSON.parse(tokenData);
      return parsed.access_token;
    } catch {
      return null;
    }
  }

  // Получение refresh токена
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    const tokenData = localStorage.getItem('token_data');
    if (!tokenData) return null;

    try {
      const parsed: TokenData = JSON.parse(tokenData);
      return parsed.refresh_token;
    } catch {
      return null;
    }
  }

  // Сохранение токенов
  public saveTokens(tokenData: TokenData): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('token_data', JSON.stringify(tokenData));
    // Сохраняем время истечения токена
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }

  // Очистка токенов
  public clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token_data');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_data');
  }

  // Обновление токена
  public async refreshAccessToken(): Promise<string> {
    // Предотвращаем множественные запросы на обновление
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const formData = new URLSearchParams();
        formData.append('grant_type', 'refresh_token');
        formData.append('client_id', process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'auth');
        formData.append('refresh_token', refreshToken);

        const response = await axios.post<TokenData>(
          `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`,
          formData.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        this.saveTokens(response.data);
        return response.data.access_token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // Проверка, истёк ли токен
  public isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;

    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;

    return Date.now() >= parseInt(expiresAt, 10);
  }

  // Базовые методы HTTP
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

// Создаём и экспортируем singleton экземпляр
export const apiClient = new ApiClient();
export default apiClient;
