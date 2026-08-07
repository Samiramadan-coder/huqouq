import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

const emirates = [
  "dubai",
  "abuDhabi",
  "sharjah",
  "ajman",
  "rasAlKhaimah",
  "fujairah",
  "ummAlQuwain",
] as const;

export default async function Coverage() {
  const locale = await getLocale();
  const t = await getTranslations("About.coverage");

  return (
    <section className="bg-[#ede9e1] py-20 sm:px-10 lg:py-30">
      <div className="container max-w-6xl">
        <h2
          className={cn("text-4xl md:text-5xl font-bold mb-8 leading-tight", {
            "font-lora": locale === "en",
          })}
        >
          {t("title")}
        </h2>

        <p className="text-lg leading-relaxed max-w-2xl mb-12 text-primary/80">
          {t("description")}
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          {emirates.map((emirate) => (
            <div
              key={emirate}
              className="min-w-28 rounded-sm border border-secondary/20 bg-background px-5 py-4"
            >
              <h3
                className={cn(
                  "text-[14px] font-semibold whitespace-nowrap text-primary",
                  { "font-lora": locale === "en" },
                )}
              >
                {t(`emirates.${emirate}.name`)}
              </h3>

              <p className="mt-1 text-[11px] whitespace-nowrap text-secondary">
                {t(`emirates.${emirate}.lawyers`)}
              </p>
            </div>
          ))}
        </div>

        <p
          className={cn("mt-10 text-[14px] italic text-secondary", {
            "font-lora": locale === "en",
          })}
        >
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
