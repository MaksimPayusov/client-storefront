/**
 * Сервис для работы с аутентификацией через Keycloak
 */

import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

// Типы
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterOwnerData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'owner';
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
}

export interface UserRolesResponse {
  roles: string[];
}

class AuthService {
  /**
   * Вход пользователя
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'auth');
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<TokenResponse>(
      API_PATHS.AUTH_LOGIN,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Сохраняем токены
    apiClient.saveTokens(response.data);

    // Получаем профиль пользователя
    await this.getUserProfile();

    return response.data;
  }

  /**
   * Регистрация обычного пользователя
   */
  async register(data: RegisterData): Promise<UserProfile> {
    const response = await apiClient.post<UserProfile>(
      API_PATHS.AUTH_REGISTER,
      {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      }
    );

    // Автоматически логиним пользователя после регистрации
    if (response.data.id) {
      await this.login({
        username: data.email,
        password: data.password,
      });
    }

    return response.data;
  }

  /**
   * Регистрация владельца магазина
   */
  async registerOwner(data: RegisterOwnerData): Promise<UserProfile> {
    const response = await apiClient.post<UserProfile>(
      API_PATHS.AUTH_REGISTER_OWNER,
      {
        ...data,
        role: 'owner',
      }
    );

    // Автоматически логиним пользователя после регистрации
    if (response.data.id) {
      await this.login({
        username: data.email,
        password: data.password,
      });
    }

    return response.data;
  }

  /**
   * Получение профиля пользователя из JWT токена
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const token = apiClient.getAccessToken();
      if (!token) return null;

      // Декодируем JWT токен
      const payload = JSON.parse(atob(token.split('.')[1]));

      const userProfile: UserProfile = {
        id: payload.sub,
        email: payload.email || payload.preferred_username,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        phone: payload.phone_number,
        isVerified: payload.email_verified || false,
        role: payload.realm_access?.roles?.[0] || 'user',
        createdAt: new Date(payload.iat * 1000).toISOString(),
      };

      // Сохраняем профиль в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(userProfile));
      }

      return userProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Получение ролей пользователя
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const response = await apiClient.get<UserRolesResponse>(
      buildPath(API_PATHS.AUTH_USER_ROLES, { userId })
    );
    return response.data.roles;
  }

  /**
   * Назначение роли пользователю
   */
  async assignRole(targetUserId: string, roleName: string): Promise<void> {
    await apiClient.post(API_PATHS.AUTH_ASSIGN_ROLE, {
      targetUserId,
      roleName,
    });
  }

  /**
   * Выход пользователя
   */
  logout(): void {
    apiClient.clearTokens();

    // Редирект на страницу логина
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  /**
   * Проверка, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    const token = apiClient.getAccessToken();
    return !!token && !apiClient.isTokenExpired();
  }

  /**
   * Получение текущего пользователя
   */
  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Обновление токена
   */
  async refreshToken(): Promise<string> {
    return apiClient.refreshAccessToken();
  }
}

// Создаём и экспортируем singleton экземпляр
export const authService = new AuthService();
export default authService;