/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./auth-context";
import { toast } from "sonner";

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

interface AddressContextType {
  addresses: Address[];
  isLoading: boolean;
  addAddress: (address: Omit<Address, "_id">) => Promise<boolean>;
  removeAddress: (addressId: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const headers = useMemo(
    () => ({
      token: token || "",
      "Content-Type": "application/json",
    }),
    [token]
  );

  const getAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (data.status === "success") {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [token, headers]);

  useEffect(() => {
    getAddresses();
  }, [getAddresses]);

  const addAddress = useCallback(
    async (address: Omit<Address, "_id">): Promise<boolean> => { 
      if (!token) return false;
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(address),
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setAddresses(data.data);
          toast.success("Address added successfully");
          return true; 
        } else {
          toast.error(data.message || "Failed to add address");
          return false; 
        }
      } catch (error) {
        toast.error("Error adding address");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token, headers]
  );

  const removeAddress = useCallback(
    async (addressId: string) => {
      if (!token) return;
      const oldAddresses = [...addresses];
      setAddresses((prev) => prev.filter((a) => a._id !== addressId));

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`,
          {
            method: "DELETE",
            headers,
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          toast.success("Address removed");
          setAddresses(data.data);
        } else {
          setAddresses(oldAddresses);
          toast.error(data.message);
        }
      } catch (error) {
        setAddresses(oldAddresses);
        toast.error("Error removing address");
      }
    },
    [token, headers, addresses]
  );

  const contextValue = useMemo(
    () => ({
      addresses,
      isLoading,
      addAddress,
      removeAddress,
    }),
    [addresses, isLoading, addAddress, removeAddress]
  );

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
}

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context)
    throw new Error("useAddress must be used within an AddressProvider");
  return context;
};