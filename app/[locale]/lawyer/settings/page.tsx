import type {
  LawyerDangerZone,
  PayoutDetailsType,
} from "@/types/lawyer/settings";
import { http } from "@/lib/http";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Account from "@/components/client-lawyer/client/settings/account";
import DangerZone from "@/components/client-lawyer/client/settings/danger-zone";
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
  const [{ data: payout }, { data: accountDelet }] = await Promise.all([
    http.get<{ data: PayoutDetailsType }>("/api/lawyer/payout-details", {
      next: { tags: ["payout-details"] },
    }),
    http.get<{ data: LawyerDangerZone }>("/api/account/deletion-check"),
  ]);

  return (
    <div className="space-y-6">
      <Account />

      <DangerZone type="lawyer" data={accountDelet.data} />

      <PayoutDetails payoutDetails={payout.data} />
    </div>
  );
}
