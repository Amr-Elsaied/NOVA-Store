/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server"; 

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brands" });
  
  const brands = await getBrands();

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand: any) => (
          <Link key={brand._id} href={`/shop?brand=${brand._id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden border-2 hover:border-primary/50">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-full aspect-video bg-white rounded-md overflow-hidden">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-lg">{brand.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}