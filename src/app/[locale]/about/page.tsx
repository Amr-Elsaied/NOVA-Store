import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server"; 

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" }); 

  return (
    <div className="min-h-screen">
      <div className="relative h-[40vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
          alt="Team working"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white space-y-4 px-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold uppercase tracking-tight">
              {t("whoWeAre")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("desc1")}
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("desc2")}
            </p>
          </div>
          <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2032&auto=format&fit=crop"
              alt="Office meeting"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-y dark:border-zinc-800 py-12">
          <div>
            <h3 className="text-4xl font-black text-primary mb-2">10k+</h3>
            <p className="text-muted-foreground">{t("customers")}</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-primary mb-2">500+</h3>
            <p className="text-muted-foreground">{t("products")}</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-primary mb-2">24/7</h3>
            <p className="text-muted-foreground">{t("support")}</p>
          </div>
          <div>
            <h3 className="text-4xl font-black text-primary mb-2">EG</h3>
            <p className="text-muted-foreground">{t("delivery")}</p>
          </div>
        </div>

        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold uppercase">{t("joinTitle")}</h2>
          <p className="text-muted-foreground">
            {t("joinDesc")}
          </p>
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8 font-bold">
              {t("cta")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}