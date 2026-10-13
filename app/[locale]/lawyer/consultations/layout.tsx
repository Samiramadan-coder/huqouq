import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import ConsultationsTabs from "@/components/client-lawyer/lawyer/consultations/consultations-tabs";

export default async function ConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.Consultations");

  return (
    <div className="py-10 container max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <Title>{t("Title")}</Title>
        <ConsultationsTabs />
      </div>

      {children}
    </div>
  );
}
