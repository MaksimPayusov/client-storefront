'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setToken } = useAuthStore()

  useEffect(() => {
    // При загрузке приложения можно проверить токен в localStorage
    // и восстановить сессию
    const checkAuth = () => {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          if (parsed.state?.user && parsed.state?.token) {
            setUser(parsed.state.user)
            setToken(parsed.state.token)
          }
        } catch (error) {
          console.error('Error parsing auth data:', error)
        }
      }
    }

    checkAuth()
  }, [setUser, setToken])

  return <>{children}</>
}