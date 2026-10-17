import { getTranslations } from "next-intl/server";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";

export default async function MyEarningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.MyEarnings");

  return (
    <div className="container max-w-5xl py-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Title>{t("Title")}</Title>
          <Hint>{t("Description")}</Hint>
        </div>
      </div>

      {children}
    </div>
  );
}
