import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Consultations.AvailabilitySettings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const t = await getTranslations("Lawyer.Consultations.AvailabilitySettings");

  // Here i will fetch and display the availability settings for the lawyer
  return <div>{t("Title")}</div>;
}
