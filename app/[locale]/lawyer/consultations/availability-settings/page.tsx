import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AvailabilitySettingsForm from "@/components/client-lawyer/lawyer/consultations/availability-settings-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Consultations.AvailabilitySettings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  // Here i will fetch and display the availability settings for the lawyer
  return (
    <div>
      <AvailabilitySettingsForm />
    </div>
  );
}
