"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 z-100 h-12 w-12 rounded-full shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 hover:shadow-xl",
        "animate-in fade-in slide-in-from-bottom-4" 
      )}
    >
      <ArrowUp className="h-6 w-6" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  )
}