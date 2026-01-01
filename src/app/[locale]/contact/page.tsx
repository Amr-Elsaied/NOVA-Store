"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl"; 

export default function ContactPage() {
  const t = useTranslations("Contact"); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("success"));
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tight">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{t("visit")}</h3>
              <p className="text-muted-foreground">
                {t("visitDesc1")}
              </p>
              <p className="text-muted-foreground">{t("visitDesc2")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{t("email")}</h3>
              <p className="text-muted-foreground">support@novastore.com</p>
              <p className="text-muted-foreground">info@novastore.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{t("call")}</h3>
              <p className="text-muted-foreground">+20 100 000 0000</p>
              <p className="text-muted-foreground">+20 120 000 0000</p>
            </div>
          </div>

          <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden border dark:border-zinc-800">
            <iframe
              src="https://maps.google.com/maps?q=Cairo,Egypt&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Maps"
            />
          </div>
        </div>

        <div className="bg-card border dark:border-zinc-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">{t("formTitle")}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("name")}</label>
                <Input
                  placeholder={t("namePlaceholder")}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("emailLabel")}</label>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("subject")}</label>
              <Input
                placeholder={t("subjectPlaceholder")}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("message")}</label>
              <Textarea
                placeholder={t("messagePlaceholder")}
                className="min-h-[150px] bg-background"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">
              {t("submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}