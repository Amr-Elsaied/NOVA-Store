"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl" 
import { cn } from "@/lib/utils" 

const SLIDES = [
  {
    id: 1,
    key: "style", 
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    key: "tech",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: 3,
    key: "gaming",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
  },
]

export default function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale(); 
  
  const isEnglish = locale === 'en';

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen">
              
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={t(`slides.${slide.key}.title`)}
                  fill
                  className="object-cover opacity-90" 
                  priority 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30" />
              </div>

              <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 md:px-12">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-2xl space-y-6"
                >
                  <h2 className={cn(
                    "text-white text-lg md:text-xl font-medium",
                    isEnglish ? "tracking-[0.2em] uppercase" : "" 
                  )}>
                    {t('badge')}
                  </h2>
                  
                  <h1 className={cn(
                    "text-white text-5xl md:text-7xl lg:text-9xl font-black leading-tight",
                    isEnglish ? "tracking-tighter uppercase" : ""
                  )}>
                    {t(`slides.${slide.key}.title`)}
                  </h1>
                  
                  <p className="text-gray-300 text-lg md:text-2xl font-light max-w-lg">
                    {t(`slides.${slide.key}.subtitle`)}
                  </p>
                  
                  <div className="flex gap-4 pt-4">
                    <Button 
                      size="lg" 
                      className={cn(
                        "rounded-none bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 font-bold",
                        isEnglish ? "uppercase tracking-widest" : ""
                      )}
                      asChild
                    >
                      <Link href="/shop">{t('ctaPrimary')}</Link>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className={cn(
                        "rounded-none border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 font-bold hidden sm:flex gap-2",
                        isEnglish ? "uppercase tracking-widest" : ""
                      )}
                      asChild
                    >
                      <Link href="/shop">
                        {t('ctaSecondary')} <ArrowRight className={cn("w-5 h-5", !isEnglish && "rotate-180")} />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden md:block absolute bottom-12 right-12 z-20 gap-2">
            <CarouselPrevious className="static translate-y-0 bg-transparent border-white/30 text-white hover:bg-white hover:text-black rounded-none h-12 w-12" />
            <CarouselNext className="static translate-y-0 bg-transparent border-white/30 text-white hover:bg-white hover:text-black rounded-none h-12 w-12" />
        </div>
      </Carousel>
    </section>
  )
}