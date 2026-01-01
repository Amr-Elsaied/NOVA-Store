/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Product } from "@/types";
import { toast } from "sonner";

interface ComparisonContextType {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

export function ComparisonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem("comparisonItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("comparisonItems", JSON.stringify(items));
  }, [items]);

  const addToCompare = useCallback(
    (product: Product) => {
      if (items.some((item) => item._id === product._id)) {
        toast.info("Product is already in comparison list");
        return;
      }
      if (items.length >= 4) {
        toast.warning("You can only compare up to 4 products");
        return;
      }
      setItems((prev) => [...prev, product]);
      toast.success("Added to comparison");
    },
    [items]
  );

  const removeFromCompare = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
    toast.success("Removed from comparison");
  }, []);

  const clearCompare = useCallback(() => {
    setItems([]);
    toast.success("Comparison list cleared");
  }, []);

  const isInCompare = useCallback(
    (productId: string) => {
      return items.some((item) => item._id === productId);
    },
    [items]
  );

  const contextValue = useMemo(
    () => ({
      items,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
    }),
    [items, addToCompare, removeFromCompare, clearCompare, isInCompare]
  );

  return (
    <ComparisonContext.Provider value={contextValue}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context)
    throw new Error("useComparison must be used within a ComparisonProvider");
  return context;
};
