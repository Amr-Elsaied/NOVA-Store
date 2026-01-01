"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Product } from "@/types"
import { cn } from "@/lib/utils"
import { useTranslations, useLocale } from "next-intl" 

interface AddToCartBtnProps {
  product: Product
  quantity?: number
  className?: string
}

export default function AddToCartBtn({ 
  product, 
  quantity = 1, 
  className, 
}: AddToCartBtnProps) {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  
  const t = useTranslations("AddToCart") 
  const locale = useLocale() 
  const isArabic = locale === "ar"

  if (!product) return null

  const isOutOfStock = (product.quantity || 0) <= 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation()
    
    setLoading(true)
    try {
      await addToCart(product._id, quantity)
    } catch (error) {
      console.error("Failed to add to cart", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading || isOutOfStock}
      className={cn(
        "flex-1 h-12 font-bold text-base bg-black hover:bg-black/90 text-white rounded-md shadow-sm transition-all dark:bg-white dark:text-black dark:hover:bg-gray-200",
        isArabic ? "tracking-normal" : "uppercase tracking-wider",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isOutOfStock ? (
        t("outOfStock") 
      ) : (
        t("add")
      )}
    </Button>
  )
}