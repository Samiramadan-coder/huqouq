import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AvailabilitySettingsForm from "@/components/client-lawyer/lawyer/consultations/availability-settings-form";
import { http } from "@/lib/http";
import { Data, Options } from "@/types/lawyer/consultations";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Consultations.AvailabilitySettings");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const { data } = await http.get<{
    options: Options;
    data: Data;
  }>("/api/lawyer/consultation-availability");

  return (
    <div>
      <AvailabilitySettingsForm options={data.options} data={data.data} />
    </div>
  );
}
