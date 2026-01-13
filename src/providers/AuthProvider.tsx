'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuth, refreshUserProfile } = useAuthStore()

  useEffect(() => {
    // Проверяем авторизацию при загрузке приложения
    const initAuth = async () => {
      try {
        const isAuthenticated = await checkAuth()

        if (isAuthenticated) {
          console.log('User is authenticated, refreshing profile...')
          await refreshUserProfile()
        } else {
          console.log('User is not authenticated')
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      }
    }

    initAuth()

    // Настраиваем периодическую проверку токена
    const checkTokenInterval = setInterval(() => {
      if (authService.isAuthenticated()) {
        refreshUserProfile()
      }
    }, 5 * 60 * 1000) // Каждые 5 минут

    // Настраиваем обработку обновления страницы
    const handleBeforeUnload = () => {
      // Сохраняем состояние авторизации
      if (typeof window !== 'undefined') {
        const user = authService.getCurrentUser()
        if (user) {
          localStorage.setItem('auth_last_check', Date.now().toString())
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(checkTokenInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [checkAuth, refreshUserProfile])

  // Добавляем обработку входа/выхода из других вкладок
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token_data' && !event.newValue) {
        // Токен был удален в другой вкладке
        window.location.reload()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return <>{children}</>
}