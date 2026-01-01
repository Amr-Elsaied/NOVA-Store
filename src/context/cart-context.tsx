/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { Cart } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  cart: Cart | null;
  numOfCartItems: number;
  totalAfterDiscount: number | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCount: (itemId: string, count: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  applyCoupon: (coupon: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState<number | null>(
    null
  );
  const { token } = useAuth();

  const getCart = async () => {
    if (!token) {
      setCart(null);
      setNumOfCartItems(0);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart?t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        setCart(data.data);
        setNumOfCartItems(data.numOfCartItems);
        setTotalAfterDiscount(data.data.totalAfterDiscount || null);
      } else {
        setCart(null);
        setNumOfCartItems(0);
      }
    } catch (error) {
      console.log("Error fetching cart", error);
    }
  };

  useEffect(() => {
    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addToCart = async (productId: string) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: { token, "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (data.status === "success") {
        toast.success("Product added to cart");
        await getCart();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`,
        {
          method: "DELETE",
          headers: { token: token!, "Content-Type": "application/json" },
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        toast.success("Item removed");
        await getCart();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const updateCount = async (itemId: string, count: number) => {
    if (count < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`,
        {
          method: "PUT",
          headers: { token: token!, "Content-Type": "application/json" },
          body: JSON.stringify({ count }),
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        await getCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "DELETE",
        headers: { token: token!, "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.message === "success") {
        setCart(null);
        setNumOfCartItems(0);
        setTotalAfterDiscount(null);
        toast.success("Cart cleared");
      }
    } catch (error) {
      toast.error("Error clearing cart");
    }
  };

  const applyCoupon = async (coupon: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/applyCoupon`,
        {
          method: "PUT",
          headers: { token: token!, "Content-Type": "application/json" },
          body: JSON.stringify({ coupon }),
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        setTotalAfterDiscount(data.data.totalAfterDiscount);
        await getCart();
        toast.success("Coupon applied! 🎉");
        return true;
      } else {
        toast.error(data.message || "Invalid coupon");
        setTotalAfterDiscount(null);
        return false;
      }
    } catch (error) {
      toast.error("Something went wrong");
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        numOfCartItems,
        totalAfterDiscount,
        addToCart,
        removeFromCart,
        updateCount,
        clearCart,
        refreshCart: getCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
