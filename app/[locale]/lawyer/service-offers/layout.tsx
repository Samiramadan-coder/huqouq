import React from "react";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export default async function ServicesOffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.ServiceOffers");
  return (
    <div className="container py-10">
      <Title>{t("title")}</Title>
      {children}
    </div>
  );
}
