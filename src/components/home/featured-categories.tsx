/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server"; 

export default async function FeaturedCategories() {
  const categories = await getCategories();
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "FeaturedCategories" });

  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 font-bold hover:underline"
          >
            {t("viewAll")} 
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat._id}`}
              className="group relative h-[400px] w-full overflow-hidden rounded-[4px] bg-gray-100"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2 text-white font-medium opacity-0 ltr:-translate-x-4 rtl:translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("explore")} 
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/shop"
          className="md:hidden flex items-center justify-center gap-2 font-bold mt-8"
        >
          {t("viewAll")} 
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}