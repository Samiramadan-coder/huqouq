import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Settings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const t = await getTranslations("Lawyer.Settings");

  return (
    <div className="container max-w-7xl py-10">
      <Title>{t("Title")}</Title>
    </div>
  );
}
