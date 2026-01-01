"use client"

import { useState } from "react"
import { Product } from "@/types"
import QuantitySelector from "./quantity-selector"
import AddToCartBtn from "./add-to-cart-btn"

interface ProductActionsProps {
  product: Product
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex items-center gap-3">
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      <AddToCartBtn product={product} quantity={quantity} />
    </div>
  )
}