import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/my-cases";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import ListOfCases from "@/components/client-lawyer/lawyer/my-cases/list-of-cases";

export default async function Page() {
  const t = await getTranslations("Lawyer.MyCases");

  const { data, ok } = await http.get<{
    data: CaseDetails[];
    meta: Meta;
  }>("/api/lawyer/my-cases");

  if (!ok) {
    throw new Error("Failed to fetch my cases");
  }

  return (
    <div className="space-y-6 container max-w-5xl">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      <ListOfCases cases={data.data} pagination={data.meta} />
    </div>
  );
}
