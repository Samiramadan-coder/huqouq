import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import { EmergencyMemberShip } from "@/types/client/emergency-membership";
import MembershipPlans from "@/components/client-lawyer/lawyer/emergency-membership/membership-plans";

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

  console.log(data.data);

  return (
    <div className="container max-w-7xl space-y-6 py-10">
      <div>
        <Title>{t("title")}</Title>
        <Hint>{t("hint")}</Hint>
      </div>

      <MembershipPlans membership={data.data} />
    </div>
  );
}
