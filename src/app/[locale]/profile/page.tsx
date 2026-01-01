"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  User,
  Lock,
  MapPin,
  Plus,
  Trash2,
  Home,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";
import { useAddress } from "@/context/address-context";

export default function ProfilePage() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const { addresses, addAddress, removeAddress } = useAddress();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const router = useRouter();
  
  const t = useTranslations("Profile");

  const infoSchema = z.object({
    name: z.string().min(3, t("validation.nameMin")),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, t("validation.phoneInvalid")),
  });

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(6, t("validation.passMin")),
      password: z.string().min(6, t("validation.passMin")),
      rePassword: z.string(),
    })
    .refine((data) => data.password === data.rePassword, {
      message: t("validation.passMismatch"),
      path: ["rePassword"],
    });

  const addressSchema = z.object({
    name: z.string().min(2, t("validation.required")),
    details: z.string().min(5, t("validation.required")),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, t("validation.phoneInvalid")),
    city: z.string().min(2, t("validation.required")),
  });

  const infoForm = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: { name: user?.name || "", email: "", phone: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: "", details: "", phone: "", city: "" },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  async function onInfoSubmit(values: z.infer<typeof infoSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/updateMe`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", token: token! },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (data.message === "success") {
        toast.success(t("messages.updateSuccess"));
        toast.info(t("messages.loginAgain"));
        logout();
      } else {
        toast.error(data.errors?.msg || t("messages.failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/changeMyPassword`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", token: token! },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (data.token) {
        toast.success(t("messages.passChanged"));
        logout();
      } else {
        toast.error(data.message || t("messages.failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onAddressSubmit(values: z.infer<typeof addressSchema>) {
    const success = await addAddress(values);
    if (success) {
      setIsAddressDialogOpen(false);
      addressForm.reset();
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-black uppercase mb-8">{t("title")}</h1>

      <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8 dark:bg-gray-950/30">
          <TabsTrigger value="general" className="gap-2">
            <User size={16} /> {t("tabs.general")}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-2">
            <MapPin size={16} /> {t("tabs.addresses")}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock size={16} /> {t("tabs.security")}
          </TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("general.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...infoForm}>
                <form
                  onSubmit={infoForm.handleSubmit(onInfoSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={infoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("general.name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={infoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("general.email")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={infoForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("general.phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting} className="mt-4">
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("general.save")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t("addresses.title")}</h2>
            <Dialog
              open={isAddressDialogOpen}
              onOpenChange={setIsAddressDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} /> {t("addresses.add")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("addresses.dialogTitle")}</DialogTitle>
                </DialogHeader>
                <Form {...addressForm}>
                  <form
                    onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={addressForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("addresses.alias")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addressForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("addresses.city")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addressForm.control}
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("addresses.details")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addressForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("general.phone")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                       {t("addresses.save")}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {addresses.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                {t("addresses.noAddresses")}
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border p-4 rounded-lg flex justify-between items-start bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      {addr.name.toLowerCase().includes("home") ? (
                        <Home size={16} />
                      ) : (
                        <Briefcase size={16} />
                      )}
                      {addr.name}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {addr.details}, {addr.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addr.phone}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeAddress(addr._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("security.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("security.current")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("security.new")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="rePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("security.confirm")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSubmitting}
                    className="mt-4"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("security.update")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}