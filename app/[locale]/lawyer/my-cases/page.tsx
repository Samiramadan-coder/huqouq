import { Suspense } from "react";
import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/my-cases";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import ListOfCases from "@/components/client-lawyer/lawyer/my-cases/list-of-cases";

type SearchParams = {
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.MyCases");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

async function GetMyCases({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data } = await http.get<{
    data: CaseDetails[];
    meta: Meta;
  }>("/api/lawyer/my-cases", {
    params: {
      page: page || "1",
    },
  });

  return <ListOfCases cases={data.data} pagination={data.meta} />;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("Lawyer.MyCases");

  return (
    <div className="space-y-6 container max-w-5xl py-10">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      <Suspense
        fallback={
          <div role="status" aria-label="Loading">
            <LoaderPinwheelIcon
              className="animate-spin text-accent"
              aria-hidden="true"
            />
          </div>
        }
      >
        <GetMyCases searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
