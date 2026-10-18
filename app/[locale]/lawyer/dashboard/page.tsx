import { http } from "@/lib/http";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Consultation } from "@/types/lawyer/consultations";
import Info from "@/components/client-lawyer/lawyer/dashboard/info";
import RecentCases from "@/components/client-lawyer/lawyer/dashboard/recent-cases";
import Consultations from "@/components/client-lawyer/lawyer/dashboard/consultations";
import LegalServices from "@/components/client-lawyer/lawyer/dashboard/legal-services";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Dashboard");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  let consultations: Consultation[] = [];

  try {
    const { data } = await http.get<{ data: Consultation[] }>(
      "/api/lawyer/consultations",
    );
    consultations = data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch consultations:", error);
  }

  return (
    <div className="container max-w-7xl mx-auto space-y-8 py-10">
      <Info />
      <LegalServices />
      <RecentCases />
      <Consultations consultations={consultations} />
    </div>
  );
}
