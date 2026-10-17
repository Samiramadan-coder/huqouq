import { http } from "@/lib/http";
import type { Metadata } from "next";
import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { Info, MoveRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Stats from "@/components/client-lawyer/lawyer/my-earnings/stats";
import type { Summary, Counts, Earning } from "@/types/lawyer/my-earnings";
import Filters from "@/components/client-lawyer/lawyer/my-earnings/filters";
import DataPreview from "@/components/client-lawyer/lawyer/my-earnings/data-preview";

type SearchParams = {
  tab?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.MyEarnings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab } = await searchParams;
  const t = await getTranslations("Lawyer.MyEarnings");

  const { data } = await http.get<{
    meta: Meta;
    counts: Counts;
    summary: Summary;
    data: Earning[];
    payout_details_missing: boolean;
  }>("/api/lawyer/earnings", {
    params: {
      tab: tab ?? "",
    },
  });

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

      <Filters counts={data.counts} />

      <DataPreview earnings={data.data} pagination={data.meta} />
    </div>
  );
}
