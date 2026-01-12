import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IUser, IAuthResponse } from '@/types'

interface AuthState {
  user: IUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registeredUsers: Array<{
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }>

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>
  logout: () => void
  setUser: (user: IUser) => void
  setToken: (token: string) => void
  clearError: () => void
  updateProfile: (data: Partial<IUser>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  confirmPassword: (token: string, password: string) => Promise<void>
  findUserByEmail: (email: string) => Promise<IUser | undefined>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registeredUsers: [],

      login: async (email: string, password: string) => {
        console.log('Login attempt:', email);
        set({ isLoading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))

          if (!email || !password) {
            throw new Error('Заполните все поля')
          }

          const { registeredUsers } = get()
          console.log('Registered users:', registeredUsers);
          const userData = registeredUsers.find(u => u.email === email && u.password === password)

          if (!userData) {
            throw new Error('Неверный email или пароль')
          }

          // Создаем объект пользователя
          const user: IUser = {
            id: Date.now().toString(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            createdAt: new Date(),
            isVerified: true,
            role: 'user'
          }

          const token = `mock-jwt-token-${Date.now()}`

          console.log('Login successful, setting state:', { user, token });

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

          // Сохраняем токен в куки для middleware
          if (typeof document !== 'undefined') {
            document.cookie = `auth-token=${token}; path=/; max-age=86400`;
          }

        } catch (error) {
          console.error('Login error:', error);
          set({
            error: error instanceof Error ? error.message : 'Ошибка авторизации',
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))

          if (!email || !password || !firstName || !lastName) {
            throw new Error('Заполните обязательные поля')
          }

          // Проверяем, не зарегистрирован ли уже пользователь
          const { registeredUsers } = get()
          if (registeredUsers.some(u => u.email === email)) {
            throw new Error('Пользователь с таким email уже существует')
          }

          // Создаем пользователя
          const user: IUser = {
            id: Date.now().toString(),
            email,
            firstName,
            lastName,
            phone,
            createdAt: new Date(),
            isVerified: false,
            role: 'user'
          }

          const token = `mock-jwt-token-${Date.now()}`

          // Сохраняем пользователя в список зарегистрированных
          set(state => ({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            registeredUsers: [
              ...state.registeredUsers,
              { email, password, firstName, lastName, phone }
            ]
          }))

          // Сохраняем токен в куки для middleware
          if (typeof document !== 'undefined') {
            document.cookie = `auth-token=${token}; path=/; max-age=86400`;
          }

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка регистрации',
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      logout: () => {
        console.log('Logging out');
        // Удаляем куку
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },

      setUser: (user: IUser) => {
        set({ user })
      },

      setToken: (token: string) => {
        set({ token })
      },

      clearError: () => {
        set({ error: null })
      },

      updateProfile: async (data: Partial<IUser>) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))

          const { user } = get()
          if (!user) {
            throw new Error('Пользователь не найден')
          }

          const updatedUser = {
            ...user,
            ...data,
            id: user.id,
            createdAt: user.createdAt
          }

          set({
            user: updatedUser,
            isLoading: false
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка обновления профиля',
            isLoading: false
          })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          console.log('Письмо для сброса пароля отправлено на:', email)
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка сброса пароля',
            isLoading: false
          })
          throw error
        }
      },

      confirmPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          console.log('Пароль успешно изменен')
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка изменения пароля',
            isLoading: false
          })
          throw error
        }
      },

      findUserByEmail: async (email: string) => {
        const { registeredUsers } = get()
        const userData = registeredUsers.find(u => u.email === email)

        if (!userData) return undefined

        return {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          createdAt: new Date(),
          isVerified: true,
          role: 'user'
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers
      }),
    }
  )
)