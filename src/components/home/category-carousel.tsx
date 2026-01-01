/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getTranslations, getLocale } from "next-intl/server"; 

export default async function CategoryCarousel() {
  const categories = await getCategories();
  const locale = await getLocale(); 
  const t = await getTranslations({ locale, namespace: "CategoryCarousel" }); 

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/25">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            {t("title")}
          </h2>
          <Link
            href="/shop"
            className="text-sm font-bold underline decoration-2 underline-offset-4 hover:text-primary"
          >
            {t("seeAll")}
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr", 
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 rtl:-mr-4 rtl:ml-0">
            {categories.map((cat: any) => (
              <CarouselItem
                key={cat._id}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 rtl:pr-4 rtl:pl-0"
              >
                <Link href={`/shop?category=${cat._id}`}>
                  <div className="group relative aspect-4/5 overflow-hidden rounded-[4px] cursor-pointer">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {cat.name}
                      </h3>

                      <span className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        {t("shopNow")}
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex -left-4 rtl:left-auto rtl:-right-4 h-12 w-12 border-2" />
          <CarouselNext className="hidden md:flex -right-4 rtl:right-auto rtl:-left-4 h-12 w-12 border-2" />
        </Carousel>
      </div>
    </section>
  );
}