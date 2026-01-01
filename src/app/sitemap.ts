import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const products = await getProducts("limit=1000");

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/en/products/${product._id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/en/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ];
}
