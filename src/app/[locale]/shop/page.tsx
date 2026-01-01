import { getProducts, getCategories } from "@/lib/api";
import ShopInterface from "@/components/shop/shop-interface";
import { getTranslations } from "next-intl/server"; 

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav" }); 

  const [products, categories] = await Promise.all([
    getProducts("limit=50").catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="text-sm text-muted-foreground mb-8">
        <span>{t("home")}</span> / <span className="text-primary font-bold">{t("shop")}</span>
      </div>

      <ShopInterface products={products} categories={categories} />
    </div>
  );
}