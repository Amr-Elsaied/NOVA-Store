"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import ProductCard from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function WishlistPage() {
  const { items } = useWishlist()
  const t = useTranslations("Wishlist")

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-red-500" />
        </div>
        <div>
            <h1 className="text-3xl font-bold mb-2">{t('emptyTitle')}</h1>
            <p className="text-muted-foreground">{t('emptyDesc')}</p>
        </div>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8 font-bold">
            {t('explore')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="text-red-500 fill-red-500" />
        <h1 className="text-3xl font-black uppercase">{t('title')} ({items.length})</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}