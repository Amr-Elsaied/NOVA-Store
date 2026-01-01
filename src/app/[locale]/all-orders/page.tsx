"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Calendar, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl"; 

interface Order {
  id: string | number;
  isPaid: boolean;
  paymentMethodType: string;
  createdAt: string;
  totalOrderPrice: number;
  cartItems: any[];
  shippingAddress?: {
    city: string;
  };
}

export default function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("Orders"); 

  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !token) return;

      try {
        const userId = (user as any).id || (user as any)._id; 

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`,
          {
            headers: { 
                token: token,
                'Content-Type': 'application/json'
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
            console.error("Failed to fetch orders");
            setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user && !authLoading) {
      fetchOrders();
    }
  }, [user, token, authLoading]);

  if (authLoading || (loadingOrders && user)) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-black uppercase mb-8 flex items-center gap-2">
        <ShoppingBag /> {t("title")}
      </h1>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xl font-bold text-muted-foreground">
              {t("noOrders")}
            </p>
          </div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id || order._id}
              className="border rounded-lg bg-card overflow-hidden shadow-sm"
            >
              <div className="bg-muted/30 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="font-bold">{t("orderNumber")} #{order.id}</div>
                  <Badge variant={order.isPaid ? "default" : "destructive"}>
                    {order.isPaid ? t("paid") : t("unpaid")}
                  </Badge>
                  <Badge variant="outline">{order.paymentMethodType}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleDateString(locale)}
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  {order.cartItems?.map((item: any) => (
                    <div
                      key={item._id || Math.random()} 
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.count}x {item.product?.title || "Product"}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price, locale)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("deliveredTo")}
                    </p>
                    <p className="font-medium">
                        {order.shippingAddress?.city || t("na")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {t("totalAmount")}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(order.totalOrderPrice, locale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}