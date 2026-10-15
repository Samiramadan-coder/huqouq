import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AvailabilitySettingsForm from "@/components/client-lawyer/lawyer/consultations/availability-settings-form";
import { http } from "@/lib/http";
import { AvailabilitySettingsResponse } from "@/types/lawyer/consultations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Consultations.AvailabilitySettings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const {
    data: { options, data },
  } = await http.get<AvailabilitySettingsResponse>(
    "/api/lawyer/consultation-availability",
  );

  return <AvailabilitySettingsForm options={options} data={data} />;
}
