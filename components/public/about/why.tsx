import Image from "next/image";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Why() {
  const locale = await getLocale();
  const t = await getTranslations("About.whyHuqouq");

  return (
    <section className="px-6 py-20 lg:py-27.5">
      <div className="container max-w-7xl grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Content */}
        <div className="max-w-140">
          <h2
            className={cn("text-4xl md:text-5xl font-bold mb-8 leading-tight", {
              "font-lora": locale === "en",
            })}
          >
            {t("title")}
          </h2>

          <div className="text-base md:text-lg leading-relaxed text-primary/80 space-y-6">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
            <p>{t("paragraph3")}</p>
          </div>
        </div>

        {/* Image */}
        <div className="relative mx-auto w-full max-w-142.5">
          <div className="relative aspect-square overflow-hidden rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <Image
              src="/about-why.png"
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 570px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
