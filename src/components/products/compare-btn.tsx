"use client";

import { ArrowRightLeft, Check } from "lucide-react";
import { useComparison } from "@/context/comparison-context";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl"; 

interface CompareBtnProps {
  product: Product;
  className?: string;
}

export default function CompareBtn({ product, className }: CompareBtnProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useComparison();
  const isCompared = isInCompare(product._id);
  const t = useTranslations("CompareBtn"); 

  const toggleCompare = () => {
    if (isCompared) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div
      onClick={toggleCompare}
      className={cn(
        "flex items-center gap-2 cursor-pointer hover:text-primary transition-colors select-none",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center transition-colors",
          isCompared ? "text-primary" : "text-current"
        )}
      >
        {isCompared ? (
          <Check className="h-5 w-5" />
        ) : (
          <ArrowRightLeft className="h-5 w-5" />
        )}
      </div>
      <span className={isCompared ? "text-primary font-medium" : ""}>
        {isCompared ? t("added") : t("compare")}
      </span>
    </div>
  );
}