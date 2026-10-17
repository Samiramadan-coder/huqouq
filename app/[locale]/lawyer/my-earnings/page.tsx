import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Info, MoveRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Summary } from "@/types/lawyer/my-earnings";
import Stats from "@/components/client-lawyer/lawyer/my-earnings/stats";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.MyEarnings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const t = await getTranslations("Lawyer.MyEarnings");

  const { data } = await http.get<{
    summary: Summary;
    payout_details_missing: boolean;
  }>("/api/lawyer/earnings");

  console.log(data);

  return (
    <div className="space-y-4">
      <Stats summary={data.summary} />

      {data.payout_details_missing && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-secondary rounded-sm px-4 py-3 mb-6">
          <div className="flex items-start gap-2.5">
            <Info className="size-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-primary/60 leading-relaxed">
              {t("MissedDataHint")}
            </p>
          </div>
          <Link
            className="flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-hover whitespace-nowrap transition-colors duration-200 shrink-0"
            href="/lawyer/settings"
          >
            {t("UpdatedDataHint")}{" "}
            <MoveRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      )}
    </div>
  );
}
