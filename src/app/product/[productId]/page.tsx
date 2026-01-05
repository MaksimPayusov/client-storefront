import ProductClientPage from './ProductClientPage'

interface ProductPageProps {
  params: Promise<{ productId: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Просто рендерим клиентский компонент
  return <ProductClientPage />
}

export const dynamic = 'force-dynamic'