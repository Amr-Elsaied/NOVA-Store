"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Heart, Search, Menu, X, ArrowRight, Loader2, User, LogOut, Package } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CartSheet from "@/components/cart/cart-sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import LangSwitcher from "./lang-switcher"
import TopBar from "./top-bar"
import { useWishlist } from "@/context/wishlist-context"
import { useAuth } from "@/context/auth-context"
import { getProducts } from "@/lib/api"
import { Product } from "@/types"

export default function Navbar() {
  const t = useTranslations("Nav")
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale() 
  
  const { items } = useWishlist()
  const wishlistCount = items ? items.length : 0

  const { user, logout } = useAuth()

  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [allProducts, setAllProducts] = React.useState<Product[]>([]) 
  const [searchResults, setSearchResults] = React.useState<Product[]>([]) 
  const [isFetching, setIsFetching] = React.useState(false) 

  const isHomePage = pathname === `/${locale}` || pathname === "/"

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    const fetchAllProducts = async () => {
      if (allProducts.length === 0) {
        setIsFetching(true)
        try {
          const products = await getProducts("limit=100")
          if (products) setAllProducts(products)
        } catch (error) {
          console.error("Failed to load products for search", error)
        } finally {
          setIsFetching(false)
        }
      }
    }
    if (isSearchOpen) {
        fetchAllProducts()
    }
  }, [isSearchOpen, allProducts.length])

  React.useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase()
      const filtered = allProducts.filter((product) => 
        product.title.toLowerCase().includes(query) || 
        product.category.name.toLowerCase().includes(query)
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allProducts])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/brands", label: t("brands") },
    { href: "/contact", label: t("contact") },
  ]

  const isTransparent = isHomePage && !isScrolled
  const textColorClass = isTransparent ? "text-white" : "text-foreground"
  const hoverColorClass = isTransparent ? "hover:text-yellow-400" : "hover:text-primary"
  const iconClass = "h-[1.2rem] w-[1.2rem]"
  const btnClass = cn("rounded-full h-10 w-10", textColorClass, hoverColorClass, "hover:bg-black/5 dark:hover:bg-white/10")

  return (
    <>
      <div 
        className={cn(
          "fixed top-0 left-0 w-full bg-background/95 backdrop-blur-md z-70 shadow-lg transition-transform duration-300 ease-in-out border-b",
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto max-w-3xl relative flex flex-col py-6 gap-4">
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                autoFocus={isSearchOpen}
                placeholder={t("search")}
                className="h-14 pl-12 pr-14 text-lg rounded-full bg-muted/50 border-2 focus-visible:ring-primary focus-visible:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isFetching ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : (
                  <Button type="submit" size="icon" variant="ghost" className="rounded-full h-10 w-10 hover:bg-transparent">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </form>
            <Button variant="ghost" onClick={() => setIsSearchOpen(false)} className="flex flex-col items-center justify-center gap-1 h-auto py-2 text-xs text-muted-foreground hover:text-destructive">
              <X className="h-6 w-6" /> {locale === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>

          {searchQuery.length > 0 && (
            <div className="bg-background border rounded-2xl shadow-lg overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 max-h-[70vh]">
              <ScrollArea className="flex-1 w-full">
                <div className="p-2 grid gap-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div key={product._id} onClick={() => handleProductClick(product._id)} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors group">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                          <Image 
                            src={product.imageCover} 
                            alt={product.title} 
                            fill 
                            sizes="64px"
                            className="object-cover group-hover:scale-110 transition-transform" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="font-semibold text-sm truncate">{product.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{product.category.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-sm text-primary">{formatPrice(product.priceAfterDiscount || product.price, locale)}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      {isFetching ? (locale === 'ar' ? "جاري التحميل..." : "Loading products...") : (
                        locale === 'ar' ? (
                          <span>لا توجد نتائج لـ &quot;<span className="font-bold text-foreground">{searchQuery}</span>&quot;.</span>
                        ) : (
                          <span>No results found for &quot;<span className="font-bold text-foreground">{searchQuery}</span>&quot;.</span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
              {searchResults.length > 0 && (
                <div className="p-3 border-t bg-muted/20 text-center shrink-0 z-10 relative">
                  <Button variant="link" onClick={handleSearchSubmit} className="h-auto py-1">
                    {locale === 'ar' ? 'عرض كل النتائج' : 'View all results'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isSearchOpen && <div className="fixed inset-0 bg-black/60 z-65 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />}

      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
        <TopBar visible={!isScrolled} />
        <header 
          className={cn(
            "w-full h-20 flex items-center transition-all duration-300", 
            isTransparent ? "bg-transparent border-b border-transparent" : "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
          )}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            
            <Link href="/" className={cn("text-2xl font-black uppercase tracking-tighter transition-colors", textColorClass)}>
              {locale === 'ar' ? 'نوفا' : 'NOVA'}<span className="text-black ">.</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn("text-sm font-bold uppercase tracking-wide transition-colors duration-200", textColorClass, hoverColorClass, pathname === link.href && !isTransparent && "text-primary", pathname === link.href && isTransparent && "text-yellow-400")}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className={btnClass}>
                <Search className={iconClass} />
              </Button>

              <div className="hidden md:flex items-center gap-1">
                <div className={cn(textColorClass)}><LangSwitcher className={btnClass} /></div>
                <div className={cn(textColorClass)}><ThemeToggle className={btnClass} /></div>
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className={cn("relative", btnClass)}>
                    <Heart className={iconClass} />
                    {wishlistCount > 0 && <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-in zoom-in shadow-sm" />}
                  </Button>
                </Link>
                <CartSheet className={btnClass} iconClass={iconClass} />
                
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn("ml-1", btnClass)}>
                        <Avatar className="h-8 w-8 border border-white/20">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1 text-left">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{locale === 'ar' ? 'أهلاً بك مجدداً' : 'Welcome back'}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer w-full text-left">{locale === 'ar' ? 'الملف الشخصي' : 'Profile'}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/all-orders" className="cursor-pointer w-full text-left">{locale === 'ar' ? 'طلباتي' : 'My Orders'}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer w-full text-left">
                        {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login" className="ml-1">
                    <Button size="sm" className="font-bold rounded-full px-6">{t("login")}</Button>
                  </Link>
                )}
              </div>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn("md:hidden", btnClass)}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-[300px] sm:w-[360px]">
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Access site navigation and account settings</SheetDescription>
                  
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b text-left">
                      
                      <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tighter">
                        {locale === 'ar' ? 'نوفا' : 'NOVA'}<span className="text-primary ">.</span>
                      </Link>

                    </div>
                    <ScrollArea className="flex-1">
                      <div className="flex flex-col p-6 gap-6">
                        <nav className="flex flex-col gap-2">
                          {navLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn("flex items-center justify-between p-3 rounded-lg transition-all hover:bg-muted", pathname === link.href ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium")}
                            >
                              {link.label}
                              {pathname === link.href && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </Link>
                          ))}
                        </nav>
                        <div className="h-px bg-border" />
                        <div className="flex flex-col gap-2 text-left">
                          <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {locale === 'ar' ? 'الحساب' : 'Account'}
                          </h4>
                          <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all">
                            <div className="flex items-center gap-3"><Heart className="h-4 w-4" /><span className="font-medium">{t("wishlist")}</span></div>
                            {wishlistCount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-red-900/30">{wishlistCount}</span>}
                          </Link>
                          {user && (
                            <>
                              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all font-medium">
                                <User className="h-4 w-4" /> {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                              </Link>
                              <Link href="/all-orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all font-medium">
                                <Package className="h-4 w-4" /> {locale === 'ar' ? 'طلباتي' : 'My Orders'}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="p-6 border-t bg-muted/30">
                      {user ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 px-2 text-left">
                            <Avatar className="h-10 w-10 border">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm line-clamp-1">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{locale === 'ar' ? 'مسجل الدخول' : 'Logged in'}</span>
                            </div>
                          </div>
                          <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                            <LogOut className="h-4 w-4" /> {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                          </Button>
                        </div>
                      ) : (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full font-bold">{locale === 'ar' ? 'تسجيل الدخول / الاشتراك' : 'Login / Register'}</Button>
                        </Link>
                      )}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center justify-between p-2 rounded-md border bg-background">
                          <span className="text-xs font-medium px-2">{locale === 'ar' ? 'المظهر' : 'Theme'}</span>
                          <ThemeToggle className="h-8 w-8" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md border bg-background">
                          <span className="text-xs font-medium px-2">{locale === 'ar' ? 'اللغة' : 'Lang'}</span>
                          <LangSwitcher className="h-8 w-8 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>
      
      {!isHomePage && <div className="h-28" />}
    </>
  )
}