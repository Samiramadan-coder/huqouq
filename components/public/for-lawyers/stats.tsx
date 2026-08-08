import {
  Award,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type Stat = {
  key: "lawyers" | "specializations" | "satisfaction" | "licensed";
  value: string;
  icon: LucideIcon;
};

const stats: Stat[] = [
  {
    key: "lawyers",
    value: "500+",
    icon: UsersRound,
  },
  {
    key: "specializations",
    value: "12",
    icon: TrendingUp,
  },
  {
    key: "satisfaction",
    value: "98%",
    icon: Award,
  },
  {
    key: "licensed",
    value: "UAE",
    icon: ShieldCheck,
  },
];

export default async function Stats() {
  const locale = await getLocale();
  const t = await getTranslations("ForLawyers.stats");

  return (
    <section className="bg-primary py-10 lg:py-11.5">
      <div className="container max-w-7xl grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {stats.map(({ key, value, icon: Icon }) => (
          <div key={key} className="text-center">
            <Icon
              className="mx-auto mb-4 size-4.5 text-secondary"
              strokeWidth={1.6}
            />

            <strong
              dir="ltr"
              className={cn(
                "block text-3xl font-bold leading-none text-white",
                {
                  "font-lora": locale === "en",
                },
              )}
            >
              {value}
            </strong>

            <span className="mt-2 block font-sans text-xs tracking-wide text-white/40 uppercase">
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
