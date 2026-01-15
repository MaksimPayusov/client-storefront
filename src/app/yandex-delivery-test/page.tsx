'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { YandexDeliveryWidget } from '@/components/delivery/YandexDeliveryWidget'

export default function YandexDeliveryTestPage() {
  const [cityInput, setCityInput] = useState('Москва')
  const [city, setCity] = useState('Москва')
  const [widgetKey, setWidgetKey] = useState(0)

  const handleApplyCity = () => {
    const nextCity = cityInput.trim() || 'Москва'
    setCity(nextCity)
    setWidgetKey(prev => prev + 1)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h1 className="text-2xl font-bold text-yellow-900">Тестовая страница Яндекс.Доставки</h1>
        <p className="text-sm text-yellow-800 mt-2">
          Здесь можно посмотреть работу виджета без оформления заказа.
        </p>
      </div>

      <section className="bg-white rounded-2xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Город</label>
          <Input
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Москва"
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleApplyCity}>Показать виджет</Button>
        </div>
      </section>

      <section className="bg-white rounded-2xl border p-6">
        <h2 className="text-xl font-bold mb-4">Виджет Яндекс.Доставки</h2>
        <YandexDeliveryWidget key={widgetKey} city={city} />
      </section>
    </div>
  )
}
