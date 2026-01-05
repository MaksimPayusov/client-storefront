'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Paintbrush, Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { themeConfig, type ThemeName } from '@/lib/theme-utils'

export default function ThemeSwitcher() {
  const { themeName, setThemeByName } = useTheme()

  const themes: ThemeName[] = [
    'Классика Dark',
    'Минимализм',
    'Эко / Беж',
    'Океан',
    'Лес',
    'Неон'
  ]

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-white rounded-xl shadow-2xl border p-4 w-64">
        <div className="flex items-center gap-2 mb-4">
          <Paintbrush className="w-4 h-4" />
          <h3 className="font-semibold">Тема магазина</h3>
        </div>

        {/* Текущая тема */}
        <div className="mb-4 p-3 rounded-lg border" style={{
          backgroundColor: themeConfig[themeName].backgroundColor,
          borderColor: themeConfig[themeName].accentColor,
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: themeConfig[themeName].textColor }}>
                {themeName}
              </div>
              <div className="text-xs opacity-70" style={{ color: themeConfig[themeName].textColor }}>
                Активная тема
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: themeConfig[themeName].primaryColor }} />
              <div className="w-4 h-4 rounded" style={{ backgroundColor: themeConfig[themeName].secondaryColor }} />
            </div>
          </div>
        </div>

        {/* Список тем */}
        <div className="space-y-2">
          {themes.map((name) => {
            const isActive = themeName === name
            const theme = themeConfig[name]

            return (
              <Button
                key={name}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setThemeByName(name)}
                style={{
                  borderColor: isActive ? theme.accentColor : '#e5e7eb',
                  backgroundColor: isActive ? `${theme.accentColor}10` : 'white',
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  {/* Предпросмотр цвета */}
                  <div className="flex gap-0.5">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.primaryColor }}
                      title="Основной цвет"
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.secondaryColor }}
                      title="Акцентный цвет"
                    />
                  </div>

                  {/* Название темы */}
                  <span style={{ color: theme.textColor }}>
                    {name}
                  </span>

                  {/* Галочка активной темы */}
                  {isActive && (
                    <Check className="ml-auto w-3 h-3" style={{ color: theme.accentColor }} />
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        {/* Информация */}
        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
          <p>Выберите тему, чтобы увидеть как она будет выглядеть в магазине</p>
        </div>
      </div>
    </div>
  )
}