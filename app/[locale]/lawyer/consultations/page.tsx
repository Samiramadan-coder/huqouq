import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Consultations.Bookings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const t = await getTranslations("Lawyer.Consultations.Bookings");

  // Here i will fetch and display the bookings for the lawyer
  return <div>{t("Title")}</div>;
}
