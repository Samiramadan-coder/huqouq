import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import PayoutDetails from "@/components/client-lawyer/lawyer/settings/payout-details";
import { http } from "@/lib/http";
import type { PayoutDetailsType } from "@/types/lawyer/settings";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Settings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const t = await getTranslations("Lawyer.Settings");

  const { data } = await http.get<{ data: PayoutDetailsType }>(
    "/api/lawyer/payout-details",
    {
      next: {
        tags: ["payout-details"],
      },
    },
  );

  console.log(data.data);

  return (
    <div className="container max-w-3xl py-10 space-y-6">
      <Title>{t("Title")}</Title>

      <PayoutDetails payoutDetails={data.data} />
    </div>
  );
}
