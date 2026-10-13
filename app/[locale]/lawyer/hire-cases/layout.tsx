import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import { getTranslations } from "next-intl/server";

export default async function HireCasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");
  return (
    <div className="container max-w-5xl space-y-6 py-10">
      <div>
        <Title>{t("hireCases")}</Title>
        <Hint>{t("hireCasesDescription")}</Hint>
      </div>
      {children}
    </div>
  );
}
