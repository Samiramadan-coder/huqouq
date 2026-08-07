import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

const stats = [
  {
    key: "lawyers",
    value: "500+",
  },
  {
    key: "specializations",
    value: "12",
  },
  {
    key: "emirates",
    value: "7",
  },
  {
    key: "emergency",
    value: "24/7",
  },
] as const;

export default async function Stats() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.stats");

  return (
    <section className="bg-primary py-10 lg:py-11.5">
      <div className="container max-w-7xl grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="text-center">
            <strong
              dir="ltr"
              className={cn(
                "block text-3xl font-bold leading-none text-white",
                {
                  "font-lora": locale === "en",
                },
              )}
            >
              {stat.value}
            </strong>

            <span className="font-sans text-xs tracking-wide text-white/40 uppercase">
              {t(stat.key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
