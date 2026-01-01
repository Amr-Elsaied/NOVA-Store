"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRightLeft } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/context/comparison-context";
import { cn, formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl"; 
import { useCart } from "@/context/cart-context";
import WishlistBtn from "./wishlist-btn";
import QuickView from "./quick-view";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCompare, isInCompare, removeFromCompare } = useComparison();
  const { addToCart } = useCart();
  const locale = useLocale();
  const t = useTranslations("ProductCard"); 
  const isArabic = locale === "ar";

  const isCompared = isInCompare(product._id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompared) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <div className="relative aspect-3/4 overflow-hidden shadow-sm bg-gray-100 rounded-[5px] mb-4">
        {product.priceAfterDiscount && (
          <Badge className="absolute top-2 ltr:left-2 rtl:right-2 z-10 bg-red-600 hover:bg-red-700 rounded-[4px] dark:text-white px-2 uppercase tracking-wide">
            {t("sale")}
          </Badge>
        )}

        <Link href={`/products/${product._id}`}>
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        
        <div className="absolute ltr:right-2 rtl:left-2 top-2 flex flex-col gap-2 ltr:translate-x-10 rtl:-translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "rounded-full h-10 w-10 shadow-md transition-colors",
              isCompared &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={toggleCompare}
            title={t("compare")}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <WishlistBtn
            product={product}
            className="h-10 w-10 rounded-full shadow-md bg-secondary hover:bg-secondary/80 border-none"
          />

          <div className="h-10 w-10 rounded-full shadow-md bg-secondary hover:bg-secondary/80 flex items-center justify-center cursor-pointer">
            <QuickView product={product} />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            onClick={() => addToCart(product._id)}
            className={cn(
              "w-full rounded-[4px] font-bold dark:bg-black dark:text-white gap-2",
              isArabic ? "tracking-normal" : "uppercase tracking-widest"
            )}
          >
            <ShoppingCart className="h-4 w-4" /> {t("addToCart")}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-base font-medium truncate hover:underline underline-offset-4 decoration-1">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            {formatPrice(product.priceAfterDiscount || product.price, locale)}
          </span>
          {product.priceAfterDiscount && (
            <span className="text-muted-foreground line-through text-xs">
              {formatPrice(product.price, locale)}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">{product.category.name}</p>
      </div>
    </motion.div>
  );
}