'use client'

import React from 'react'
import { useShopStore } from '@/store/shop.store'

interface ShopDomainProps {
  showFullUrl?: boolean
  className?: string
}

export const ShopDomain: React.FC<ShopDomainProps> = ({
  showFullUrl = false,
  className = ''
}) => {
  const shop = useShopStore((state) => state.shop)

  const domain = showFullUrl
    ? `${shop.domain}.fashionconstruct.ru`
    : shop.domain

  return (
    <span className={`font-mono text-sm ${className}`}>
      {domain}
    </span>
  )
}