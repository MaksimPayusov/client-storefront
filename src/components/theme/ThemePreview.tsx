// компонент ThemePreview для теста

'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'
import { Paintbrush } from 'lucide-react'

const ThemePreview = () => {
  const { theme, setTheme } = useTheme()

  // Предустановленные темы
  const presetThemes = [
    {
      name: 'Стандартная',
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#10b981',
      },
    },
    {
      name: 'Тёмная',
      theme: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#3b82f6',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        accentColor: '#0ea5e9',
      },
    },
    {
      name: 'Зелёная',
      theme: {
        primaryColor: '#10b981',
        secondaryColor: '#0ea5e9',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#f59e0b',
      },
    },
    {
      name: 'Розовая',
      theme: {
        primaryColor: '#ec4899',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#f97316',
      },
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white rounded-xl shadow-2xl border p-4 w-64">
        <div className="flex items-center gap-2 mb-4">
          <Paintbrush className="w-4 h-4" />
          <h3 className="font-semibold">Тема магазина</h3>
        </div>

        {/* Предпросмотр текущей темы */}
        <div className="mb-4 space-y-2">
          <div className="flex gap-1 h-4 rounded overflow-hidden">
            {Object.entries(theme).map(([key, color]) => (
              <div
                key={key}
                className="flex-1"
                style={{ backgroundColor: color }}
                title={`${key}: ${color}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Текущая тема
          </p>
        </div>

        {/* Кнопки предустановленных тем */}
        <div className="space-y-2">
          {presetThemes.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme(preset.theme)}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Object.entries(preset.theme).map(([_, color]) => (
                    <div
                      key={color}
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span>{preset.name}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Сброс к дефолтной */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => setTheme(presetThemes[0].theme)}
        >
          Сбросить тему
        </Button>
      </div>
    </div>
  )
}

export default ThemePreview