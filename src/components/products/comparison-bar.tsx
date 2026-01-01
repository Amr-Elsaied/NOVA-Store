"use client";

import Image from "next/image";
import { Link, usePathname } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Trash2 } from "lucide-react";
import { useComparison } from "@/context/comparison-context";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl"; 

export default function ComparisonFloatingBar() {
  const pathname = usePathname();
  const { items, removeFromCompare, clearCompare } = useComparison();
  const t = useTranslations("ComparisonBar"); 

  if (items.length === 0) return null;
  if (pathname?.includes("/compare")) return null;

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t dark:border-white/10 shadow-2xl pb-safe"
        >
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
              <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                <span className="hidden md:inline-block text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {t("selected", { count: items.length })}
                </span>

                <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0 scroll-smooth">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ scale: 0, width: 0 }}
                        animate={{ scale: 1, width: "auto" }}
                        exit={{ scale: 0, width: 0 }}
                        className="relative group shrink-0"
                      >
                        <div className="w-12 h-16 md:w-14 md:h-18 bg-white rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm relative">
                          <Image
                            src={item.imageCover}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeFromCompare(item._id)}
                            className="absolute top-0.5 right-0.5 bg-black/50 hover:bg-red-600 text-white rounded-full p-0.5 backdrop-blur-sm transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto mt-1 md:mt-0 border-t dark:border-gray-800  md:border-t-0 pt-2 md:pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompare}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none h-10 md:h-11 rounded-full text-xs md:text-sm"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> {t("clear")}
                </Button>

                <Link href="/compare" className="flex-2 md:flex-none">
                  <Button className="w-full md:w-auto gap-2 rounded-full font-bold px-6 md:px-8 h-10 md:h-11 bg-gray-950 dark:hover:bg-black text-white hover:bg-black dark:bg-white dark:text-black dark:hover:text-white shadow-md text-xs md:text-base">
                    {t("compare")} <span className="hidden sm:inline">{t("now")}</span>{" "}
                    <ArrowRight size={14} className="md:h-4 md:w-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}