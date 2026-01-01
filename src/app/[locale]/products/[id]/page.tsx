/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Truck, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server"; 

import { getProductById } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import ProductImageGallery from "@/components/products/product-image-gallery";
import BuyNowBtn from "@/components/products/buy-now-btn";
import WishlistBtn from "@/components/products/wishlist-btn";
import CompareBtn from "@/components/products/compare-btn";
import AddReview from "@/components/products/add-review";
import RelatedProducts from "@/components/products/related-products";
import ReviewsList from "@/components/products/reviews-list";
import AddToCartBtn from "@/components/products/add-to-cart-btn";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  
  const t = await getTranslations({ locale, namespace: "Product" });

  try {
    const product = await getProductById(id);
    return {
      title: `${product.title} | ${t('storeName')}`,
      description: product.description.slice(0, 160),
      openGraph: { images: [product.imageCover] },
    };
  } catch (error) {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id, locale } = await params;
  
  const t = await getTranslations({ locale, namespace: "Product" });

  let product;
  try {
    product = await getProductById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20">
        <div className="lg:col-span-7">
          <ProductImageGallery
            images={product.images || [product.imageCover]}
            title={product.title}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight dark:text-white text-gray-900 mb-3">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold dark:text-white text-gray-900">
                  {formatPrice(
                    product.priceAfterDiscount || product.price,
                    locale
                  )}
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price, locale)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full border">
                <StarRating rating={product.ratingsAverage} />
                <span className="text-xs font-bold text-gray-600 pt-0.5">
                  ({product.ratingsQuantity})
                </span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <AddToCartBtn
              product={product}
              className="w-full dark:bg-white dark:text-black cursor-pointer"
            />
            <BuyNowBtn productId={product._id} />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-sm dark:text-gray-300 text-gray-600">
            <WishlistBtn product={product} withText={true} />
            <CompareBtn product={product} />
          </div>

          <div className="flex items-center gap-4 bg-[#EBF7EE] p-4 rounded-lg mt-2 border border-[#d3e9d8]">
            <div className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-gray-900 text-lg font-bold text-gray-900 shrink-0">
              %
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{t('rewards')}</h4>
              <p className="text-sm text-gray-700">
                {t('earnPoints', { points: Math.floor(product.price) })}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-500 pt-4 space-y-1">
            <p>
              {t('sku')}:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                NV-{product._id.slice(-6).toUpperCase()}
              </span>
            </p>
            <p>
              {t('category')}:{" "}
              <Link
                href={`/shop?category=${product.category._id}`}
                className="font-medium text-gray-900 hover:underline dark:text-white"
              >
                {product.category.name}
              </Link>
            </p>
            {product.brand && (
              <p>
                {t('brand')}:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {product.brand.name}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b py-8 mb-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <Truck className="h-8 w-8 text-gray-900 dark:text-white" />
          <h5 className="font-bold text-sm uppercase">{t('freeShipping')}</h5>
          <p className="text-xs text-gray-500">{t('freeShippingDesc')}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-gray-900 dark:text-white" />
          <h5 className="font-bold text-sm uppercase">{t('securePayment')}</h5>
          <p className="text-xs text-gray-500">{t('securePaymentDesc')}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <CheckCircle className="h-8 w-8 text-gray-900 dark:text-white" />
          <h5 className="font-bold text-sm uppercase">{t('qualityChecked')}</h5>
          <p className="text-xs text-gray-500">{t('qualityCheckedDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black uppercase mb-6">
            {t('reviews')} ({product.ratingsQuantity})
          </h2>
          <AddReview productId={product._id} />
          <ReviewsList productId={product._id} />
        </div>

        <div className="lg:col-span-3 mt-12 pt-12 border-t">
          <RelatedProducts
            categoryId={product.category._id}
            currentProductId={product._id}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}