import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import { EmergencyMemberShip } from "@/types/lawyer/emergency-membership";
import Stats from "@/components/client-lawyer/lawyer/emergency-membership/stats";
import MembershipPlans from "@/components/client-lawyer/lawyer/emergency-membership/membership-plans";
import BillingHistory from "@/components/client-lawyer/lawyer/emergency-membership/billing-history";

export default async function Page() {
  const t = await getTranslations("Lawyer.EmergencyMembership");

  const { data } = await http.get<{ data: EmergencyMemberShip }>(
    "/api/lawyer/emergency/membership",
    {
      next: {
        tags: ["emergency-membership"],
      },
    },
  );

  // console.log(data.data);

  return (
    <div className="container max-w-7xl space-y-6 py-10">
      <div>
        <Title>{t("title")}</Title>
        <Hint>{t("hint")}</Hint>
      </div>

      <MembershipPlans membership={data.data} />

      <Stats stats={data.data.stats} />

      {data.data.billing.length > 0 && (
        <BillingHistory billing={data.data.billing} card={data.data.card} />
      )}
    </div>
  );
}
