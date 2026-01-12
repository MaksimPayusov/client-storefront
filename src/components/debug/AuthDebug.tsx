'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { isDebugMode } from '@/lib/env'

export function AuthDebug() {
  const authState = useAuthStore();

  useEffect(() => {
    console.log('Auth store updated:', {
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      token: authState.token,
      isLoading: authState.isLoading
    });
  }, [authState.user, authState.isAuthenticated, authState.token, authState.isLoading]);

  // Не показывать в продакшене
  if (!isDebugMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs">
      <div>Auth Debug:</div>
      <div>User: {authState.user ? 'Yes' : 'No'}</div>
      <div>Authenticated: {authState.isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Token: {authState.token ? 'Yes' : 'No'}</div>
      <div className="mt-2 text-[10px] opacity-70">
        Store: {JSON.stringify({
          user: !!authState.user,
          isAuthenticated: authState.isAuthenticated,
          token: !!authState.token
        })}
      </div>
    </div>
  );
}