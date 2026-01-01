"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (q: number) => void;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md h-12">
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-none px-3 hover:bg-gray-100 text-gray-500"
        onClick={decrease}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="flex-1 flex items-center justify-center min-w-12 font-medium h-full border-x border-gray-300">
        {quantity}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-none px-3 hover:bg-gray-100 text-gray-500"
        onClick={increase}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
