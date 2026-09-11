import { Suspense } from "react";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LoaderPinwheelIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/my-cases";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import ListOfCases from "@/components/client-lawyer/lawyer/my-cases/list-of-cases";

async function GetMyCases() {
  const { data, ok } = await http.get<{
    data: CaseDetails[];
    meta: Meta;
  }>("/api/lawyer/my-cases");

  if (!ok) {
    throw new Error("Failed to fetch my cases");
  }

  return <ListOfCases cases={data.data} pagination={data.meta} />;
}

export default async function Page() {
  const t = await getTranslations("Lawyer.MyCases");

  return (
    <div className="space-y-6 container max-w-5xl">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      <Suspense
        fallback={<LoaderPinwheelIcon className="animate-spin text-accent" />}
      >
        <GetMyCases />
      </Suspense>
    </div>
  );
}
