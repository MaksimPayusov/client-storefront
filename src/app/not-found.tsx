import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold mb-4">Страница не найдена</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        К сожалению, запрашиваемая страница не существует или была перемещена.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg">
            <Home className="mr-2 w-5 h-5" />
            На главную
          </Button>
        </Link>
        <Link href="/catalog">
          <Button variant="outline" size="lg">
            <ShoppingBag className="mr-2 w-5 h-5" />
            В каталог
          </Button>
        </Link>
      </div>
    </div>
  )
}