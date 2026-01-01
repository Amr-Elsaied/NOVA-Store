import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/shared/navbar";
import { ComparisonProvider } from "@/context/comparison-context";
import { Toaster } from "@/components/ui/sonner";
import ComparisonBar from "@/components/products/comparison-bar";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import type { Metadata } from "next";
import { AddressProvider } from "@/context/address-context";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "@/components/shared/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

const inter = Inter({ subsets: ["latin"] });
const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "NOVA Store | Premium Shopping Experience",
    template: "%s | NOVA Store"
  },
  description: "Discover the latest trends in fashion and electronics at NOVA Store. Best prices, original products, and fast shipping across Egypt.",
  keywords: ["Shopping", "Ecommerce", "Fashion", "Electronics", "Egypt", "NOVA"],
  authors: [{ name: "NOVA Team" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'NOVA Store',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'NOVA Store'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVA Store',
    description: 'Premium Shopping Experience',
    creator: '@novastore'
  },
  icons: {
    icon: '/favicon.ico',
  }
}

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  const direction = "ltr"; 

  const mainFont = locale === "ar" ? cairo.className : inter.className;

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={mainFont}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <CartProvider>
                <ComparisonProvider>
                  <WishlistProvider>
                    <AddressProvider>
                      <Navbar />
                      <main className="min-h-screen">{children}</main>
                      <Footer />
                      <ScrollToTop />
                      <Toaster position="bottom-left" />
                      <ComparisonBar />
                    </AddressProvider>
                  </WishlistProvider>
                </ComparisonProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}