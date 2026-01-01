"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../../lib/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LangSwitcherProps {
  className?: string;
  iconClass?: string;
}

export default function LangSwitcher({ className }: LangSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); 

  const switchLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";

    router.replace(pathname, { locale: newLocale });
  };

  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchLanguage}
      className={cn("rounded-full w-9 h-9", className)}
      title={locale === "en" ? "Switch to Arabic" : "حول للإنجليزية"}
    >
      <span className="font-bold text-xs">{locale === "en" ? "AR" : "EN"}</span>
      <span className="sr-only">Toggle Language</span>
    </Button>
  );
}
