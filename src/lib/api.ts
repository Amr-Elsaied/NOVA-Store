/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error(`Failed to fetch from ${endpoint}`);

  const json = await res.json();
  return json.data;
}

export async function getProducts(query: string = "") {
  return fetchAPI<Product[]>(`/products?${query}`, {
    next: { revalidate: 60 },
  });
}

export async function getProductById(id: string) {
  return fetchAPI<Product>(`/products/${id}`, { next: { revalidate: 60 } });
}

export async function getCategories() {
  return fetchAPI<any[]>(`/categories`, { next: { revalidate: 3600 } });
}

export async function getBrands() {
  return fetchAPI<any[]>(`/brands`, { next: { revalidate: 3600 } });
}

export async function getProductReviews(productId: string) {
  return fetchAPI<any[]>(`/reviews?product=${productId}`, {
    next: { revalidate: 60 },
  });
}

export async function getRelatedProducts(categoryId: string) {
  return fetchAPI<Product[]>(`/products?category[in]=${categoryId}&limit=4`, {
    next: { revalidate: 60 },
  });
}

export async function getSubCategories(categoryId: string) {
  return fetchAPI<any[]>(`/categories/${categoryId}/subcategories`, {
    next: { revalidate: 3600 },
  });
}
