"use client";

import { useState } from "react";
import {  useRouter } from "@/lib/navigation";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useTranslations } from "next-intl"; 

interface BuyNowBtnProps {
  productId: string;
}

export default function BuyNowBtn({ productId }: BuyNowBtnProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("BuyNowBtn"); 

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      await addToCart(productId);
      router.push("/checkout");
    } catch (error) {
      console.error("Failed to buy now:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-11 font-bold gap-2 mt-3 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
      onClick={handleBuyNow}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Zap className="h-4 w-4 fill-current" />
      )}
      {t("buyNow")}
    </Button>
  );
}