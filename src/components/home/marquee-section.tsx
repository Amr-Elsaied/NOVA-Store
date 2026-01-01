import { useTranslations, useLocale } from "next-intl"; // استيراد أدوات الترجمة
import { cn } from "@/lib/utils"; // لدمج الكلاسات بشرط اللغة

export default function MarqueeSection() {
  const t = useTranslations("Marquee");
  const locale = useLocale();
  
  const textContent = t("text");
  const items = Array(10).fill(textContent);

  const textStyle = locale === "ar" 
    ? "tracking-normal font-bold" 
    : "tracking-[0.2em] font-black uppercase";

  return (
    <div className="bg-black text-white py-3 overflow-hidden border-y border-white/10 relative z-10">
      <div className="flex w-max animate-marquee">
        <div className="flex items-center">
          {items.map((text, i) => (
            <div key={`a-${i}`} className="flex items-center mx-4">
              <span className={cn("text-sm whitespace-nowrap", textStyle)}>
                {text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          {items.map((text, i) => (
            <div key={`b-${i}`} className="flex items-center mx-4">
              <span className={cn("text-sm whitespace-nowrap", textStyle)}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}