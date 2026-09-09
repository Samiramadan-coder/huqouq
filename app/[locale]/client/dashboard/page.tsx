import { http } from "@/lib/http";
import { CaseDetails, Counts } from "@/types/client/cases";
import Stats from "@/components/client-lawyer/client/dashboard/stats";
import WelcomeText from "@/components/client-lawyer/reusable/welcome-text";
import NeedHelp from "@/components/client-lawyer/client/dashboard/need-help";
import RecentCases from "@/components/client-lawyer/client/dashboard/recent-cases";
import LegalServices from "@/components/client-lawyer/client/dashboard/legal-services";

export default async function DashboardPage() {
  const { data, ok } = await http.get<{
    data: CaseDetails[];
    counts: Counts;
  }>("/api/cases");

  if (!ok) {
    throw new Error("Failed to fetch cases");
  }

  return (
    <div className="container max-w-7xl space-y-6">
      <WelcomeText />
      <Stats activeCases={data.counts.all} hasOffers={data.counts.has_offers} />
      <NeedHelp />
      <LegalServices />
      <RecentCases cases={data.data} />
    </div>
  );
}
