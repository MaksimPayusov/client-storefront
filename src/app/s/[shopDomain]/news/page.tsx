import { redirect } from 'next/navigation'

export default async function ShopNewsRedirect({
  params,
}: {
  params: Promise<{ shopDomain: string }>
}) {
  const { shopDomain } = await params
  redirect(`/news?shop=${encodeURIComponent(shopDomain)}`)
}
