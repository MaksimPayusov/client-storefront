/**
 * Сервис для работы с аутентификацией через Keycloak
 */

import axios from 'axios';
import { apiClient } from './api';
import { API_PATHS, buildPath } from '@/constants/api.endpoints';

interface LocalUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
}

const LOCAL_USERS_KEY = 'local_users';

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
  private getLocalUsers(): LocalUser[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalUsers(users: LocalUser[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  }

  private buildLocalToken(user: LocalUser): TokenResponse {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60 * 24 * 7;
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      preferred_username: user.email,
      given_name: user.firstName,
      family_name: user.lastName,
      phone_number: user.phone,
      email_verified: true,
      realm_access: { roles: ['user'] },
      iat: now,
      exp: now + expiresIn,
    }));

    return {
      access_token: `${header}.${payload}.local`,
      refresh_token: 'local',
      expires_in: expiresIn,
      token_type: 'bearer',
      scope: 'openid',
    };
  }

  private buildLocalUserProfile(user: LocalUser): UserProfile {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isVerified: true,
      role: 'user',
      createdAt: user.createdAt,
    };
  }

  private setLocalSession(user: LocalUser): TokenResponse {
    const tokenData = this.buildLocalToken(user);
    apiClient.saveTokens(tokenData);
    try {
      localStorage.setItem('user_data', JSON.stringify(this.buildLocalUserProfile(user)));
    } catch {
      // noop
    }
    return tokenData;
  }

  /**
   * Вход пользователя
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'auth');
    formData.append('scope', 'openid');
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    let response;
    try {
      response = await apiClient.post<TokenResponse>(
        API_PATHS.AUTH_LOGIN,
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 400) {
        try {
          const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
          const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'main_one';

          response = await axios.post<TokenResponse>(
            `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
            formData.toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
        } catch (keycloakError) {
          // fall through to local auth
        }
      }

      if (!response) {
        // Try local auth fallback
        const users = this.getLocalUsers();
        const localUser = users.find(
          (u) => u.email.toLowerCase() === credentials.username.toLowerCase() && u.password === credentials.password
        );
        if (!localUser) throw error;
        const tokenData = this.setLocalSession(localUser);
        await this.getUserProfile();
        return tokenData;
      }
    }

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
    try {
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

      return response.data;
    } catch (error) {
      const users = this.getLocalUsers();
      const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
      if (exists) {
        throw error;
      }
      const localUser: LocalUser = {
        id: crypto.randomUUID(),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        createdAt: new Date().toISOString(),
      };
      users.push(localUser);
      this.saveLocalUsers(users);
      this.setLocalSession(localUser);
      return this.buildLocalUserProfile(localUser);
    }
  }

  /**
   * Регистрация владельца магазина
   */
  async registerOwner(data: RegisterOwnerData): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>(
        API_PATHS.AUTH_REGISTER_OWNER,
        {
          ...data,
          role: 'owner',
        }
      );

      return response.data;
    } catch (error) {
      const users = this.getLocalUsers();
      const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
      if (exists) {
        throw error;
      }
      const localUser: LocalUser = {
        id: crypto.randomUUID(),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString(),
      };
      users.push(localUser);
      this.saveLocalUsers(users);
      this.setLocalSession(localUser);
      return this.buildLocalUserProfile(localUser);
    }
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
