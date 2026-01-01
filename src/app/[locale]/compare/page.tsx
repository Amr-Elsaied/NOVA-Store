"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingCart, AlertCircle, X } from "lucide-react"
import { useComparison } from "@/context/comparison-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { formatPrice, cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl" 
import { StarRating } from "@/components/ui/star-rating"

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useComparison()
  const { addToCart } = useCart()
  const locale = useLocale()
  const t = useTranslations("Compare") 

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <AlertCircle className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-3 tracking-tight text-zinc-900 dark:text-white">{t("noItemsTitle")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-base md:text-lg">
          {t("noItemsDesc")}
        </p>
        <Link href="/shop">
          <Button size="lg" className="font-bold px-8 rounded-full shadow-lg hover:shadow-xl transition-all">{t("browseProducts")}</Button>
        </Link>
      </div>
    )
  }

  const comparisonRows = [
    { label: t("rating"), key: "rating" },
    { label: t("price"), key: "price" },
    { label: t("brand"), key: "brand" },
    { label: t("category"), key: "category" },
    { label: t("availability"), key: "stock" },
    { label: t("description"), key: "description" },
  ]

  const ROW_HEIGHT = "h-14 md:h-16"
  const HEADER_HEIGHT = "h-[160px] md:h-[340px]"

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-12 min-h-screen">
      
      <div className="flex items-center justify-between mb-4 md:mb-8 px-1">
        <div>
            <h1 className="text-xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">{t("title")}</h1>
            <p className="hidden md:block text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
        </div>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={clearCompare} 
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-900/30 dark:bg-transparent dark:hover:bg-red-950/30 h-8 text-xs md:text-sm"
        >
           <Trash2 className="h-3 w-3 md:h-4 md:w-4" /> {t("clearAll")}
        </Button>
      </div>

      <div className="flex border dark:border-zinc-800 rounded-lg md:rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/5 relative">
        
        <div className="hidden md:flex w-56 shrink-0 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-sm border-r dark:border-zinc-800 flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            
            <div className={cn(HEADER_HEIGHT, "p-6 flex items-end pb-4 font-bold text-xs uppercase tracking-wider text-muted-foreground/80 border-b dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50")}>
               {t("productDetails")}
            </div>
            
            <div className="flex flex-col bg-white dark:bg-zinc-950">
                {comparisonRows.map((row, idx) => (
                    <div 
                        key={row.label} 
                        className={cn(
                            ROW_HEIGHT, 
                            "px-6 flex items-center font-bold text-sm text-zinc-700 dark:text-zinc-300 border-b dark:border-zinc-800 last:border-0",
                            idx % 2 === 0 ? "bg-zinc-50/50 dark:bg-zinc-900/50" : "bg-white dark:bg-zinc-950"
                        )}
                    >
                        {row.label}
                    </div>
                ))}
            </div>
            
            <div className="h-24 bg-zinc-50/50 dark:bg-zinc-900/50"></div>
        </div>

        <div className="flex-1 overflow-x-auto custom-scrollbar bg-white dark:bg-zinc-950 scroll-smooth">
            <div className="flex">
                {items.map((product) => (
                    <div 
                        key={product._id} 
                        className="min-w-[130px] w-[35vw] md:w-[300px] md:min-w-[300px] border-r dark:border-zinc-800 last:border-0 flex flex-col bg-white dark:bg-zinc-950 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors duration-300 relative group"
                    >
                        
                        <div className={cn(HEADER_HEIGHT, "p-2 md:p-6 flex flex-col gap-2 border-b dark:border-zinc-800 relative")}>
                             <button 
                                onClick={() => removeFromCompare(product._id)}
                                className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 bg-zinc-50/80 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-all z-10 shadow-sm border border-zinc-100 dark:border-zinc-700"
                             >
                                <X className="h-3 w-3 md:h-4 md:w-4" />
                             </button>

                             <Link href={`/products/${product._id}`} className="relative flex-1 w-full bg-white rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm mb-1">
                                <Image 
                                    src={product.imageCover} 
                                    alt={product.title} 
                                    fill 
                                    className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                                />
                             </Link>
                             
                             <div className="h-[36px] md:h-[48px] flex items-center justify-center text-center">
                                <Link href={`/products/${product._id}`} className="font-bold text-[11px] md:text-base text-zinc-900 dark:text-zinc-100 hover:text-primary line-clamp-2 leading-tight">
                                    {product.title}
                                </Link>
                             </div>
                        </div>

                        <div className="flex flex-col text-center">
                            
                            <div className={cn(ROW_HEIGHT, "px-1 md:px-6 flex flex-col md:flex-row items-center justify-center border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50")}>
                                <span className="md:hidden text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-0.5">{t("rating")}</span>
                                <div className="flex items-center gap-1 bg-white dark:bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm scale-90 md:scale-100 origin-center">
                                    <StarRating rating={product.ratingsAverage} size={10} />
                                    <span className="text-[9px] md:text-xs font-semibold text-zinc-500 dark:text-zinc-400">({product.ratingsQuantity})</span>
                                </div>
                            </div>

                            <div className={cn(ROW_HEIGHT, "px-1 md:px-6 flex flex-col md:flex-row items-center justify-center border-b dark:border-zinc-800")}>
                                <span className="md:hidden text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-0.5">{t("price")}</span>
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-primary text-sm md:text-xl">
                                        {formatPrice(product.priceAfterDiscount || product.price, locale)}
                                    </span>
                                    {product.priceAfterDiscount && (
                                        <span className="text-[9px] md:text-sm text-muted-foreground line-through decoration-red-500/50 dark:decoration-red-400/50">
                                            {formatPrice(product.price, locale)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={cn(ROW_HEIGHT, "px-1 md:px-6 flex flex-col md:flex-row items-center justify-center border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50")}>
                                <span className="md:hidden text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-0.5">{t("brand")}</span>
                                <span className="text-[11px] md:text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
                                    {product.brand?.name || "-"}
                                </span>
                            </div>

                            <div className={cn(ROW_HEIGHT, "px-1 md:px-6 flex flex-col md:flex-row items-center justify-center border-b dark:border-zinc-800")}>
                                <span className="md:hidden text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-0.5">{t("category")}</span>
                                <span className="text-[11px] md:text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-1">
                                    {product.category?.name || "-"}
                                </span>
                            </div>

                            <div className={cn(ROW_HEIGHT, "px-1 md:px-6 flex flex-col md:flex-row items-center justify-center border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50")}>
                                <span className="md:hidden text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-0.5">{t("availability")}</span>
                                {product.quantity > 0 ? (
                                    <span className="text-[9px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 truncate max-w-full">
                                        {t("inStock")}
                                    </span>
                                ) : (
                                    <span className="text-[9px] md:text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/50 truncate max-w-full">
                                        {t("outOfStock")}
                                    </span>
                                )}
                            </div>

                             <div className={cn(ROW_HEIGHT, "px-2 md:px-6 flex flex-col md:flex-row items-center justify-center border-b dark:border-zinc-800")}>
                                <span className="md:hidden text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-0.5">{t("description")}</span>
                                <span className="text-[10px] md:text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                    {product.description || "-"}
                                </span>
                            </div>
                        </div>

                        <div className="h-16 md:h-24 px-2 md:px-6 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 border-t dark:border-zinc-800">
                            <Button 
                                onClick={() => addToCart(product._id)} 
                                disabled={product.quantity <= 0}
                                size="sm" 
                                className="w-full font-bold shadow-sm rounded-md md:rounded-xl h-8 md:h-11 text-[10px] md:text-sm px-1"
                            >
                                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                                {product.quantity > 0 ? t("add") : t("out")}
                            </Button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}