import { redirect } from 'next/navigation'

export default async function ShopBrandsRedirect({
  params,
}: {
  params: Promise<{ shopDomain: string }>
}) {
  const { shopDomain } = await params
  redirect(`/brands?shop=${encodeURIComponent(shopDomain)}`)
}
