/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Truck, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl"; 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddress } from "@/context/address-context";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const { addresses } = useAddress();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Checkout"); 

  const formSchema = z.object({
    details: z.string().min(10, { message: t("validation.details") }),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, { message: t("validation.phone") }),
    city: z.string().min(2, { message: t("validation.city") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: "",
      phone: "",
      city: "",
    },
  });

  const handleAddressSelect = (addressId: string) => {
    const selected = addresses.find((a) => a._id === addressId);
    if (selected) {
      form.setValue("city", selected.city);
      form.setValue("details", selected.details);
      form.setValue("phone", selected.phone);
    }
  };

  if (!cart || cart.products.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">{t("emptyCart")}</h2>
        <Button onClick={() => router.push("/")} className="mt-4">
          {t("goShopping")}
        </Button>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!cart) return;

    setIsLoading(true);
    const toastId = toast.loading(t("processing"));

    try {
      const shippingAddress = values;
      let apiUrl = "";

      if (paymentMethod === "cash") {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/${cart._id}`;
      } else {
        const domain = window.location.origin;
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/checkout-session/${cart._id}?url=${domain}`;
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token!,
        },
        body: JSON.stringify({ shippingAddress }),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.dismiss(toastId);

        if (paymentMethod === "cash") {
          toast.success(t("success"));
          clearCart();
          router.push("/all-orders");
        } else {
          toast.success(t("redirecting"));
          window.location.href = data.session.url;
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-black uppercase mb-8">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-primary" /> {t("shippingAddress")}
            </h2>

            {addresses.length > 0 && (
              <div className="mb-6 border-b pb-6">
                <Label className="block mb-3 text-muted-foreground">
                  {t("selectSaved")}
                </Label>
                <RadioGroup
                  onValueChange={handleAddressSelect}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="flex items-start space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <RadioGroupItem
                        value={addr._id}
                        id={addr._id}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={addr._id}
                        className="cursor-pointer w-full"
                      >
                        <div className="font-bold">{addr.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {addr.details}, {addr.city}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {addr.phone}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <Form {...form}>
              <form
                id="checkout-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("phonePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("cityPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("addressDetails")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("addressPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-primary" /> {t("paymentMethod")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-gray-400"
                }`}
              >
                <Truck className="h-8 w-8 mb-2" />
                <span className="font-bold">{t("cashOnDelivery")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === "online"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-gray-400"
                }`}
              >
                <CreditCard className="h-8 w-8 mb-2" />
                <span className="font-bold">{t("onlinePayment")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 sticky top-24 border">
            <h3 className="text-xl font-bold mb-4">{t("orderSummary")}</h3>

            <div className="space-y-3 mb-6">
              {cart.products.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.count}x{" "}
                    {item.product?.title 
                      ? item.product.title.split(" ").slice(0, 3).join(" ") 
                      : t("unknownProduct")}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.count, locale)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-bold text-lg">
                <span>{t("total")}</span>
                <span className="text-primary">
                  {formatPrice(cart.totalCartPrice, locale)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              className="w-full mt-6 h-12 text-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : paymentMethod === "cash" ? (
                t("placeOrderCash")
              ) : (
                t("proceedPayment")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}