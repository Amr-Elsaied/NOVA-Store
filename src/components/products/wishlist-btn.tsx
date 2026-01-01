"use client"

import { Heart } from "lucide-react"
import { useWishlist } from "@/context/wishlist-context"
import { Product } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl" 

interface WishlistBtnProps {
  product: Product
  className?: string
  withText?: boolean
}

export default function WishlistBtn({ product, className, withText = false }: WishlistBtnProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const t = useTranslations("WishlistBtn") 
  
  const inWishlist = isInWishlist(product._id)

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      await removeFromWishlist(product._id)
    } else {
      await addToWishlist(product)
    }
  }

  if (withText) {
    return (
      <div 
        onClick={toggleWishlist}
        className={cn("flex items-center gap-2 cursor-pointer hover:text-primary transition-colors select-none", className)}
      >
        <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500 text-red-500")} />
        <span className={inWishlist ? "text-red-500 font-medium" : ""}>
            {inWishlist ? t("added") : t("add")}
        </span>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleWishlist}
      className={cn("rounded-full hover:bg-muted", className)}
    >
      <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500 text-red-500")} />
      <span className="sr-only">{t("add")}</span>
    </Button>
  )
}