import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShoppingBag } from 'lucide-react'

interface CartEmptyStateProps {
  title?: string
  description?: string
  showButton?: boolean
}

export function CartEmptyState({
  title = 'Корзина пуста',
  description = 'Добавьте товары из каталога',
  showButton = true
}: CartEmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-2xl">
      <div className="text-5xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {showButton && (
        <Link href="/catalog">
          <Button size="lg" variant="theme-primary">
            <ShoppingBag className="mr-2 w-5 h-5" />
            Перейти в каталог
          </Button>
        </Link>
      )}
    </div>
  )
}