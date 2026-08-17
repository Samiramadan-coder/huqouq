import Image from "next/image";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import Logo from "@/components/icons/logo";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("About.hero");
  const locale = await getLocale();

  return (
    <section className="min-h-160 lg:min-h-162.5 overflow-x-hidden">
      <div className="grid min-h-[inherit] lg:grid-cols-[55%_45%]">
        {/* Content */}
        <div className="bg-background">
          <div className="flex h-full items-center">
            <div className="w-full px-6 py-16 sm:px-10 lg:px-20 xl:px-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-145"
              >
                <span className="mb-8 block text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  {t("eyebrow")}
                </span>

                <h1
                  className={cn(
                    "max-w-130 text-4xl font-semibold leading-tight text-balance text-primary md:text-5xl lg:text-[3.5rem] mb-6",
                    { "font-lora": locale === "en" },
                  )}
                >
                  {t("title")}
                </h1>

                <p className="text-[#5a6a77] text-base md:text-lg leading-relaxed text-balance max-w-lg">
                  {t("description")}
                </p>

                {/* Divider */}
                <div className="mt-10 flex max-w-143.75 items-center gap-4">
                  <span className="h-px flex-1 bg-accent/60" />
                  <Logo />
                  <span className="h-px flex-1 bg-accent/60" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center bg-primary px-6 py-12 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -32 : 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="relative w-full max-w-112.5"
          >
            <div className="rounded-[11px] border border-accent p-2.25">
              <div className="relative aspect-4/5 overflow-hidden rounded-[6px]">
                <Image
                  src="/about-hero.png"
                  alt={t("imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 450px"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
