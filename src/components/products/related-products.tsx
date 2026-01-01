
import Link from "next/link";
import Image from "next/image";
import { getRelatedProducts } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { getTranslations } from "next-intl/server"; 

export default async function RelatedProducts({
  categoryId,
  currentProductId,
  locale,
}: {
  categoryId: string;
  currentProductId: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "RelatedProducts" });

  const products = await getRelatedProducts(categoryId);
  const related = products.filter((p: Product) => p._id !== currentProductId);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-black uppercase mb-6">
        {t("title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product: Product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow border-none bg-gray-50 dark:bg-gray-900/25">
              <CardContent className="p-4">
                <div className="relative aspect-square mb-3 bg-white rounded-md overflow-hidden">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm line-clamp-1 mb-1">
                  {product.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary">
                    {formatPrice(product.price, locale)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {product.ratingsAverage} ★
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}