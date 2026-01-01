"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl"; 
import { cn } from "@/lib/utils"; 

export default function PromoBanner() {
  const t = useTranslations("PromoBanner"); 
  const locale = useLocale(); 
  const isArabic = locale === "ar";

  return (
    <section className="relative h-[600px] w-full bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed bg-no-repeat">
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative container mx-auto h-full flex flex-col justify-center items-center text-center text-white px-4">
        <span 
          className={cn(
            "text-sm md:text-base font-bold uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000",
            isArabic ? "tracking-normal" : "tracking-widest"
          )}
        >
          {t("badge")}
        </span>

        <h2 
          className={cn(
            "text-4xl md:text-6xl lg:text-7xl font-black uppercase mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200",
             isArabic ? "tracking-normal leading-tight" : "tracking-tight"
          )}
        >
          {t("titleLine1")} <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
            {t("titleLine2")}
          </span>
        </h2>

        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {t("description")}
        </p>

        <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Link href="/shop">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold bg-white text-black hover:bg-gray-200 rounded-none"
            >
              {t("ctaPrimary")}
            </Button>
          </Link>

          <Link href="/shop?category=men">
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-bold text-white border-white hover:bg-white hover:text-black rounded-none bg-transparent"
            >
              {t("ctaSecondary")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}