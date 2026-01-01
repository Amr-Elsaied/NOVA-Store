/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { getBrands } from "@/lib/api";
import { getTranslations, getLocale } from "next-intl/server"; 

export default async function BrandsSection() {
  const brands = await getBrands();
  const locale = await getLocale(); 
  const t = await getTranslations({ locale, namespace: "BrandsSection" }); 

  return (
    <section className="py-20 bg-white dark:bg-black overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">
          {t("title")}
        </h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="relative w-full overflow-hidden border-y border-gray-100 dark:border-gray-800/25 bg-gray-50/50 dark:bg-gray-950/15 py-10">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white dark:from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white dark:from-black to-transparent z-10" />

        <div className="flex w-max animate-marquee hover:paused">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8">
              {brands.map((brand: any) => (
                <Link
                  key={`${i}-${brand._id}`}
                  href={`/shop?brand=${brand._id}`}
                  className="group relative w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}