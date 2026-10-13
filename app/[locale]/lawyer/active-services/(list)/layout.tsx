import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export default async function ActiveServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.ActiveServices");

  return (
    <div className="container py-10 space-y-6">
      <Title>{t("title")}</Title>
      {children}
    </div>
  );
}
