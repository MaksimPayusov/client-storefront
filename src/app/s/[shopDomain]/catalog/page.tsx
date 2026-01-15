import { redirect } from 'next/navigation'

export default async function ShopCatalogRedirect({
  params,
}: {
  params: Promise<{ shopDomain: string }>
}) {
  const { shopDomain } = await params
  redirect(`/catalog?shop=${encodeURIComponent(shopDomain)}`)
}
