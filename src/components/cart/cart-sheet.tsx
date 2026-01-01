"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  ArrowRight,
  X,
  ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl"; 
import Link from "next/link";

export default function CartSheet({
  className,
  iconClass,
}: {
  className?: string;
  iconClass?: string;
}) {
  const {
    cart,
    numOfCartItems,
    removeFromCart,
    updateCount,
    applyCoupon,
    totalAfterDiscount,
    clearCart,
  } = useCart();
  const locale = useLocale();
  const t = useTranslations("Cart"); 

  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplying(true);
    await applyCoupon(couponCode);
    setIsApplying(false);
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      setIsConfirmingClear(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsClearing(false);
    }
  };

  const hasItems = cart && cart.products && cart.products.length > 0;

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
          className
        )}
      >
        <ShoppingCart className={cn("h-5 w-5", iconClass)} />
        {numOfCartItems > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-in zoom-in shadow-sm" />
        )}
      </SheetTrigger>

      <SheetContent
        className="w-full sm:w-[450px] flex flex-col p-0 h-full gap-0"
        side="right"
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold">
              <ShoppingCart className="h-5 w-5" /> {t("title")}
              <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
                {numOfCartItems}
              </span>
            </SheetTitle>

            {hasItems && (
              <div className="flex items-center">
                {!isConfirmingClear ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsConfirmingClear(true)}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs"
                    title={t("clearAll")}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    {t("clearAll")}
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 bg-red-50 p-1 rounded-md animate-in fade-in slide-in-from-right-5 duration-200">
                    <span className="text-[10px] font-bold text-red-600 px-1">
                      {t("confirmClear")}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleClearCart}
                      disabled={isClearing}
                      className="h-6 px-2 text-[10px]"
                    >
                      {isClearing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        t("yes")
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsConfirmingClear(false)}
                      disabled={isClearing}
                      className="h-6 px-2 text-[10px] hover:bg-red-100 text-red-700"
                    >
                      {t("no")}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetHeader>

        {!hasItems ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-6">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center border-2 border-dashed">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{t("empty")}</h3>
              <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
                {t("emptyDesc")}
              </p>
            </div>
            <SheetClose asChild>
              <Button variant="outline" className="mt-4">
                {t("continueShopping")}
              </Button>
            </SheetClose>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full min-h-0">
            <div className="p-6 space-y-4">
              {cart.products.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors shadow-sm relative group"
                >
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="absolute top-2 right-2 text-muted-foreground/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border shrink-0 self-center flex items-center justify-center">
                    {item.product.imageCover ? (
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title || t("imageAlt")}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    <div className="pr-6">
                      <h4
                        className="font-bold text-sm line-clamp-2 leading-tight mb-1"
                        title={item.product.title}
                      >
                        {item.product.title || t("unknown")}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {item.product.category?.name || t("general")}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">
                          {t("price")}
                        </span>
                        <span className="font-bold text-base text-primary">
                          {formatPrice(item.price, locale)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md hover:bg-background shadow-none"
                          onClick={() =>
                            updateCount(item.product._id, item.count - 1)
                          }
                          disabled={false}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs font-bold w-6 text-center tabular-nums">
                          {item.count}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md hover:bg-background shadow-none"
                          onClick={() =>
                            updateCount(item.product._id, item.count + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {hasItems && (
          <div className="p-6 bg-muted/10 border-t shrink-0 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("promoPlaceholder")}
                  className="pl-9 bg-background"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
              <Button
                variant="secondary"
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode}
                className="font-bold"
              >
                {t("apply")}
              </Button>
            </div>

            <div className="space-y-2 bg-background p-4 rounded-xl border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span
                  className={cn(
                    "font-medium",
                    totalAfterDiscount &&
                      "line-through text-muted-foreground/70"
                  )}
                >
                  {formatPrice(cart!.totalCartPrice, locale)}
                </span>
              </div>

              {totalAfterDiscount && (
                <div className="flex items-center justify-between text-sm text-green-600 font-bold">
                  <span>{t("discount")}</span>
                  <span>{formatPrice(totalAfterDiscount, locale)}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-dashed pt-3 mt-2">
                <span className="font-bold text-lg">{t("total")}</span>
                <span className="font-bold text-xl text-primary">
                  {formatPrice(
                    totalAfterDiscount || cart!.totalCartPrice,
                    locale
                  )}
                </span>
              </div>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full font-bold h-12 text-base gap-2 shadow-md">
                    {t("checkout")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </SheetClose>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}