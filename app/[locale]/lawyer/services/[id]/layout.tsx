import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import React from "react";
import { getTranslations } from "next-intl/server";

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.LegalServices.Details");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <BackBtn>{t("backToServices")}</BackBtn>
      {children}
    </div>
  );
}
