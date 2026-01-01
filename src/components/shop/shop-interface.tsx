/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import ProductCard from "@/components/products/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslations } from "next-intl" 

interface FiltersListProps {
  categories: any[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
  subCategories: any[] 
  selectedSubCategory: string | null
  onSelectSubCategory: (id: string) => void
}

function FiltersList({ categories, selectedCategory, onSelectCategory, subCategories, selectedSubCategory, onSelectSubCategory }: FiltersListProps) {
  const t = useTranslations("Shop"); 

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-4 text-lg">{t("categoriesTitle")}</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => onSelectCategory("all")}
          >
            {t("allCategories")}
          </Button>
          {categories.map((cat) => (
            <div key={cat._id} className="flex flex-col">
              <Button
                variant={selectedCategory === cat._id ? "default" : "ghost"}
                className="justify-start"
                onClick={() => onSelectCategory(cat._id)}
              >
                {cat.name}
              </Button>
              
              {selectedCategory === cat._id && subCategories.length > 0 && (
                <div className="ml-4 mt-1 border-l-2 pl-2 flex flex-col gap-1">
                  {subCategories.map((sub: any) => (
                    <Button
                      key={sub._id}
                      variant={selectedSubCategory === sub._id ? "secondary" : "ghost"}
                      className="justify-start h-8 text-sm"
                      onClick={() => onSelectSubCategory(sub._id)}
                    >
                      <ChevronRight className="h-3 w-3 mr-1" /> {sub.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ShopInterfaceProps {
  products: Product[]
  categories: any[]
}

export default function ShopInterface({ products, categories }: ShopInterfaceProps) {
  const searchParams = useSearchParams()
  const t = useTranslations("Shop"); 
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("default")

  useEffect(() => {
    const brandFromUrl = searchParams.get("brand")
    if (brandFromUrl) setSelectedBrandId(brandFromUrl)
  }, [searchParams])

  useEffect(() => {
    if (selectedCategory !== "all") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedCategory}/subcategories`)
        .then(res => res.json())
        .then(data => setSubCategories(data.data || []))
        .catch(() => setSubCategories([]))
    } else {
      setSubCategories([])
      setSelectedSubCategory(null)
    }
  }, [selectedCategory])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category._id === selectedCategory
      const matchesBrand = selectedBrandId ? product.brand._id === selectedBrandId : true
      
      const matchesSubCategory = selectedSubCategory 
        ? product.subcategory?.some((sub: any) => sub._id === selectedSubCategory)
        : true

      return matchesSearch && matchesCategory && matchesBrand && matchesSubCategory
    })
    .sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price
      if (sortOption === "price-high") return b.price - a.price
      return 0
    })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedSubCategory(null)
    setSelectedBrandId(null)
  }

  const FiltersProps = {
    categories,
    selectedCategory,
    onSelectCategory: (id: string) => { setSelectedCategory(id); setSelectedSubCategory(null); },
    subCategories,
    selectedSubCategory,
    onSelectSubCategory: setSelectedSubCategory
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          <FiltersList {...FiltersProps} />
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder={t("searchPlaceholder")} 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2 flex-1">
                  <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mt-8">
                  <FiltersList {...FiltersProps} />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t("sortFeatured")}</SelectItem>
                <SelectItem value="price-low">{t("sortLowHigh")}</SelectItem>
                <SelectItem value="price-high">{t("sortHighLow")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold uppercase">{t("shopTitle")}</h1>
          <Badge variant="secondary" className="text-sm">{filteredProducts.length} {t("productsCount")}</Badge>

          {selectedBrandId && (
            <Badge variant="default" className="gap-1 pl-2 pr-1 py-1">
              {t("brandFilter")} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedBrandId(null)} />
            </Badge>
          )}

          {(selectedCategory !== "all" || selectedBrandId || searchQuery) && (
            <Button variant="link" className="text-red-500 h-auto p-0 ml-auto" onClick={clearFilters}>
              {t("clearFilters")}
            </Button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-muted-foreground text-lg">{t("noProducts")}</p>
            <Button variant="link" onClick={clearFilters}>{t("clearFilters")}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}