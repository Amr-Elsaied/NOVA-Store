/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/product-card";
import { getTranslations, getLocale } from "next-intl/server"; 

export default async function FeaturedProducts() {
  const products = await getProducts("sort=-createdAt&limit=8");
  
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "FeaturedProducts" });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
            {t("title")}
          </h2>
          <Link
            href="/shop"
            className="group flex items-center gap-2 font-bold hover:underline"
          >
            {t("viewAll")} 
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}