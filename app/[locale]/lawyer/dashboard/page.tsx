import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Info from "@/components/client-lawyer/lawyer/dashboard/info";
import RecentCases from "@/components/client-lawyer/lawyer/dashboard/recent-cases";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Dashboard");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  return (
    <div className="container max-w-7xl mx-auto space-y-6 py-10">
      <Info />
      <RecentCases />
    </div>
  );
}
