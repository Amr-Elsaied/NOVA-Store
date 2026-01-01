"use client";


import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslations } from "next-intl"; 

interface TopBarProps {
  visible: boolean;
}

export default function TopBar({ visible }: TopBarProps) {
  const t = useTranslations("TopBar"); 

  return (
    <div
      className={cn(
        "bg-black dark:bg-zinc-950 text-white text-[11px] font-medium py-2.5 px-4 transition-all duration-300 ease-in-out overflow-hidden border-b border-white/10 dark:border-zinc-800",
        visible ? "h-10 opacity-100" : "h-0 opacity-0 py-0"
      )}
    >
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex items-center gap-5">
          <Link href="#" className="hover:text-gray-300 transition-colors">
            <FaFacebook className="h-3.5 w-3.5 fill-current" />
          </Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">
            <FaXTwitter className="h-3.5 w-3.5 fill-current" />
          </Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">
            <FaInstagram className="h-3.5 w-3.5" />
          </Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">
            <FaYoutube className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-1 uppercase tracking-wide">
          <span className="opacity-90 hidden sm:inline">
            {t("promo")}
          </span>
          <Link
            href="/shop"
            className="underline decoration-1 underline-offset-2 hover:text-gray-300 font-bold ml-1"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}