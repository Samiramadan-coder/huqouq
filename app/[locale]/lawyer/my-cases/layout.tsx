import React from "react";
import { getTranslations } from "next-intl/server";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";

export default async function MyCasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Lawyer.MyCases");
  return (
    <div className="space-y-6 container max-w-5xl py-10">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Description")}</Hint>
      </div>

      {children}
    </div>
  );
}
