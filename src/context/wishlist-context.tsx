/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "./auth-context"
import { toast } from "sonner"
import { Product } from "@/types"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const { token } = useAuth()

  const headers = useMemo(() => ({
    token: token || "",
    "Content-Type": "application/json"
  }), [token])

  const getWishlist = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        method: "GET",
        headers
      })
      const data = await res.json()
      if (data.status === "success") {
        const uniqueItems = Array.from(new Map(data.data.map((item: Product) => [item._id, item])).values()) as Product[]
        setItems(uniqueItems)
      }
    } catch (error) {
      console.log("Wishlist Error", error)
    }
  }, [token, headers])

  useEffect(() => {
    if (token) getWishlist()
    else setItems([])
  }, [token, getWishlist])

  const addToWishlist = useCallback(async (product: Product) => {
    if (!token) {
      toast.error("Please login first")
      return
    }

    setItems((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev
      return [...prev, product]
    })

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productId: product._id })
      })
      const data = await res.json()

      if (data.status === "success") {
        toast.success("Added to wishlist")
        getWishlist() 
      } else {
        setItems((prev) => prev.filter((item) => item._id !== product._id))
        toast.error(data.message)
      }
    } catch (error) {
      setItems((prev) => prev.filter((item) => item._id !== product._id))
      toast.error("Error adding to wishlist")
    }
  }, [token, headers, getWishlist])

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!token) return

    const oldItems = [...items]
    setItems((prev) => prev.filter((item) => item._id !== productId))

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers
      })
      const data = await res.json()
      
      if (data.status === "success") {
        toast.success("Removed from wishlist")
      } else {
        setItems(oldItems)
        toast.error(data.message)
      }
    } catch (error) {
       setItems(oldItems)
       toast.error("Error removing from wishlist")
    }
  }, [token, headers, items])

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item._id === productId)
  }, [items])

  const contextValue = useMemo(() => ({
    items, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist
  }), [items, addToWishlist, removeFromWishlist, isInWishlist])

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider")
  return context
}