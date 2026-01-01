/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; 

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("userToken"); 
      if (storedToken) {
        try {
          const decoded: any = jwtDecode(storedToken);
          setToken(storedToken);
          setUser({ id: decoded.id, name: decoded.name, role: decoded.role });
        } catch (error) {
          localStorage.removeItem("userToken");
          Cookies.remove("userToken");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(
    (newToken: string) => {
      localStorage.setItem("userToken", newToken);
      Cookies.set("userToken", newToken, { expires: 7 }); 

      const decoded: any = jwtDecode(newToken);
      setToken(newToken);
      setUser({ id: decoded.id, name: decoded.name, role: decoded.role });
      
      router.refresh();
    },
    [router]
  ); 

  const logout = useCallback(() => {
    localStorage.removeItem("userToken");
    Cookies.remove("userToken");
    
    setToken(null);
    setUser(null);
    
    router.push("/login");
    router.refresh();
  }, [router]);

  const contextValue = useMemo(
    () => ({
      token,
      user,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};