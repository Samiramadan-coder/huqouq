import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { http } from "@/lib/http";
import type { PayoutDetailsType } from "@/types/lawyer/settings";
import PayoutDetails from "@/components/client-lawyer/lawyer/settings/payout-details";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Settings");

  return {
    title: `${t("Title")} | Huqouq`,
    description: t("Description"),
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const { data } = await http.get<{ data: PayoutDetailsType }>(
    "/api/lawyer/payout-details",
    { next: { tags: ["payout-details"] } },
  );

  return <PayoutDetails payoutDetails={data.data} />;
}
