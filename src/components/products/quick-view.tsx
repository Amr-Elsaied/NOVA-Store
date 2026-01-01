"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Star } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import AddToCartBtn from "./add-to-cart-btn";
import WishlistBtn from "./wishlist-btn";
import { useLocale, useTranslations } from "next-intl"; 
import { useState } from "react";

interface QuickViewProps {
  product: Product;
}

export default function QuickView({ product }: QuickViewProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("QuickView");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full h-10 w-10 shadow-md hover:bg-primary hover:text-white dark:hover:text-black transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Eye className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden bg-white dark:bg-black border-none">
        <div className="sr-only">
          <DialogTitle>{product.title}</DialogTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-auto overflow-y-auto">
          <div className="relative bg-gray-100 dark:bg-gray-900/20 h-64 md:h-full min-h-[400px] flex items-center justify-center p-6">
            <div className="relative w-full h-full">
              <Image
                src={product.imageCover}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="p-6 md:p-10 flex flex-col h-full">
            <div className="mb-auto">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-muted-foreground">
                  {product.category.name}
                </Badge>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="fill-current h-4 w-4" />
                  <span>{product.ratingsAverage}</span>
                </div>
              </div>

              <h2 className="text-2xl font-black uppercase mb-4 leading-tight">
                {product.title}
              </h2>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(
                    product.priceAfterDiscount || product.price,
                    locale
                  )}
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-lg text-muted-foreground line-through mb-1">
                    {formatPrice(product.price, locale)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-4">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <AddToCartBtn product={product} />
                <WishlistBtn
                  product={product}
                  className="h-12 w-12 rounded-md dark:bg-gray-800/20 bg-gray-600/10  border-input"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between items-center text-sm">
              <Link
                href={`/products/${product._id}`}
                className="text-primary hover:underline font-bold"
                onClick={() => setOpen(false)}
              >
                {t("viewDetails")}
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}