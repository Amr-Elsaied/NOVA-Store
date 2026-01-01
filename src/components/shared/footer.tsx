import Link from "next/link";
import { useTranslations } from "next-intl"; 

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              {t("storeName")}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest mb-6 text-sm">
              {t("shop")}
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  {t("allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  {t("newArrivals")}
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  {t("bestSellers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-white transition-colors"
                >
                  {t("ourBrands")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest mb-6 text-sm">
              {t("company")}
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest mb-6 text-sm">
              {t("stayUpdated")}
            </h3>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="bg-white/10 border-none text-white placeholder:text-gray-500 px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
              <button className="bg-white text-black font-bold uppercase text-xs py-3 rounded-sm hover:bg-gray-200 transition-colors">
                {t("subscribe")}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}