import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CTA() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.cta");

  return (
    <section className="bg-primary px-6 py-20 sm:px-10 lg:py-27.5">
      <div className="mx-auto max-w-180 text-center">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
          {t("eyebrow")}
        </span>

        <h2
          className={cn(
            "text-3xl md:text-4xl font-semibold leading-tight mb-12 mt-5 text-balance text-white",
            { "font-lora": locale === "en" },
          )}
        >
          {t("title")}
        </h2>

        <p className="mx-auto mt-5 max-w-130 text-[15px] leading-relaxed text-white/50 sm:text-[16px]">
          {t("description")}
        </p>

        <div className="mt-10">
          <Link
            href="/cases/create"
            className="inline-flex h-13 min-w-53.75 items-center justify-center gap-4 rounded-sm bg-secondary px-8 text-[14px] font-semibold text-primary transition-opacity hover:opacity-90"
          >
            {t("button")}

            <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </section>
  );
}
