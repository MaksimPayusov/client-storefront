import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IUser } from '@/types'
import { authService } from '@/services/auth.service'

interface AuthState {
  user: IUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>
  registerOwner: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  setUser: (user: IUser) => void
  setToken: (token: string) => void
  clearError: () => void
  updateProfile: (data: Partial<IUser>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  confirmPassword: (token: string, password: string) => Promise<void>
  refreshUserProfile: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        console.log('Login attempt:', email);
        set({ isLoading: true, error: null })

        try {
          const tokenData = await authService.login({
            username: email,
            password,
          })

          // Получаем профиль пользователя
          const userProfile = await authService.getUserProfile()

          if (!userProfile) {
            throw new Error('Не удалось получить профиль пользователя')
          }

          const user: IUser = {
            id: userProfile.id,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone,
            createdAt: new Date(userProfile.createdAt),
            isVerified: userProfile.isVerified,
            role: userProfile.role as 'user' | 'admin'
          }

          console.log('Login successful, setting state:', { user })

          set({
            user,
            token: tokenData.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

        } catch (error: any) {
          console.error('Login error:', error);

          let errorMessage = 'Ошибка авторизации'
          if (error.response?.status === 401) {
            errorMessage = 'Неверный email или пароль'
          } else if (error.response?.status === 400) {
            errorMessage = 'Неверный формат запроса'
          } else if (error.message) {
            errorMessage = error.message
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          })
          throw new Error(errorMessage)
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
        set({ isLoading: true, error: null })

        try {
          const userProfile = await authService.register({
            email,
            password,
            firstName,
            lastName,
            phone,
          })

          const user: IUser = {
            id: userProfile.id,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone,
            createdAt: new Date(userProfile.createdAt),
            isVerified: userProfile.isVerified,
            role: userProfile.role as 'user' | 'admin' | 'owner'
          }

          set({
            user,
            token: authService.getCurrentUser() ? 'registered' : null,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

        } catch (error: any) {
          console.error('Register error:', error);

          let errorMessage = 'Ошибка регистрации'
          if (error.response?.status === 409) {
            errorMessage = 'Пользователь с таким email уже существует'
          } else if (error.message) {
            errorMessage = error.message
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          })
          throw new Error(errorMessage)
        }
      },

      registerOwner: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ isLoading: true, error: null })

        try {
          const userProfile = await authService.registerOwner({
            email,
            password,
            firstName,
            lastName,
            role: 'owner',
          })

          const user: IUser = {
            id: userProfile.id,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            createdAt: new Date(userProfile.createdAt),
            isVerified: userProfile.isVerified,
            role: 'owner'
          }

          set({
            user,
            token: authService.getCurrentUser() ? 'registered' : null,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

        } catch (error: any) {
          console.error('Register owner error:', error);

          let errorMessage = 'Ошибка регистрации владельца'
          if (error.response?.status === 409) {
            errorMessage = 'Пользователь с таким email уже существует'
          } else if (error.message) {
            errorMessage = error.message
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false
          })
          throw new Error(errorMessage)
        }
      },

      logout: () => {
        console.log('Logging out');
        authService.logout()

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
          // TODO: Реализовать обновление профиля через API
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
        } catch (error: any) {
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
          // TODO: Реализовать сброс пароля через API
          await new Promise(resolve => setTimeout(resolve, 1000))
          console.log('Письмо для сброса пароля отправлено на:', email)
          set({ isLoading: false })
        } catch (error: any) {
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
          // TODO: Реализовать подтверждение пароля через API
          await new Promise(resolve => setTimeout(resolve, 1000))
          console.log('Пароль успешно изменен')
          set({ isLoading: false })
        } catch (error: any) {
          set({
            error: error instanceof Error ? error.message : 'Ошибка изменения пароля',
            isLoading: false
          })
          throw error
        }
      },

      refreshUserProfile: async () => {
        try {
          const userProfile = await authService.getUserProfile()

          if (userProfile) {
            const user: IUser = {
              id: userProfile.id,
              email: userProfile.email,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              phone: userProfile.phone,
              createdAt: new Date(userProfile.createdAt),
              isVerified: userProfile.isVerified,
              role: userProfile.role as 'user' | 'admin' | 'owner'
            }

            set({ user })
          }
        } catch (error) {
          console.error('Error refreshing user profile:', error)
        }
      },

      checkAuth: async () => {
        const isAuthenticated = authService.isAuthenticated()

        if (isAuthenticated) {
          await get().refreshUserProfile()
        } else {
          set({ user: null, token: null, isAuthenticated: false })
        }

        return isAuthenticated
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
