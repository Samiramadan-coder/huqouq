import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Story() {
  const t = await getTranslations("About.story");
  const locale = await getLocale();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-25">
      {/* Background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <ShieldCheck strokeWidth={0.8} className="size-45 text-[#1E405D]/2.5" />
      </div>

      <div className="relative z-10 mx-auto max-w-170 text-center">
        {/* Top line */}
        <div className="mx-auto mb-7 h-px w-9 bg-secondary/60" />

        {/* Eyebrow */}
        <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary">
          {t("eyebrow")}
        </span>

        {/* Title */}
        <h2
          className={cn(
            "text-3xl md:text-4xl font-semibold text-primary leading-tight mb-12 mt-5 text-balance",
            { "font-lora": locale === "en" },
          )}
        >
          {t("title")}
        </h2>

        {/* Content */}
        <div
          className={cn(
            "text-primary/70 font-serif leading-[1.85] text-[1.0625rem] md:text-[1.125rem] space-y-6",
            { "font-lora": locale === "en" },
          )}
        >
          <p>{t("paragraph1")}</p>
          <p>{t("paragraph2")}</p>
          <p>{t("paragraph3")}</p>
          <p>{t("paragraph4")}</p>
        </div>

        {/* Signature */}
        <p className="mt-10 font-serif text-[14px] italic text-secondary">
          {t("team")}
        </p>

        {/* Bottom line */}
        <div className="mx-auto mt-9 h-px w-9 bg-secondary/40" />
      </div>
    </section>
  );
}
