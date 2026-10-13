import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { getTranslations } from "next-intl/server";

export default async function CaseDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.BrowseCases");

  return (
    <div className="container max-w-5xl space-y-6 py-10">
      <BackBtn>
        <span>{t("BackToCases")}</span>
      </BackBtn>
      {children}
    </div>
  );
}
