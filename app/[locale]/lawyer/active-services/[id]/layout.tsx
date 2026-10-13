import { getTranslations } from "next-intl/server";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";

export default async function ActiveServiceDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.ActiveServices.Details");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <BackBtn>{t("backToServices")}</BackBtn>
      {children}
    </div>
  );
}
