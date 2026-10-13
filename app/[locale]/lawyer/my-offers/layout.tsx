import { getTranslations } from "next-intl/server";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";

export default async function MyOffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.MyOffers");

  return (
    <div className="space-y-6 container max-w-7xl py-10">
      <div className="space-y-2">
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      {children}
    </div>
  );
}
