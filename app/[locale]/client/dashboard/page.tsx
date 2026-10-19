import { http } from "@/lib/http";
import { CaseDetails, Counts } from "@/types/client/my-cases";
import Stats from "@/components/client-lawyer/client/dashboard/stats";
import WelcomeText from "@/components/client-lawyer/reusable/welcome-text";
import NeedHelp from "@/components/client-lawyer/client/dashboard/need-help";
import type { Counts as ConsultationCounts } from "@/types/client/consultation";
import RecentCases from "@/components/client-lawyer/client/dashboard/recent-cases";
import LegalServices from "@/components/client-lawyer/client/dashboard/legal-services";
import RecommendedLawyers from "@/components/client-lawyer/client/dashboard/recommended-lawyers";
import { Lawyer } from "@/types/client/find-lawyer";

export default async function DashboardPage() {
  const [cases, consultations, recommendedLawyers] = await Promise.all([
    http.get<{
      data: CaseDetails[];
      counts: Counts;
    }>("/api/cases"),

    http.get<{
      counts: ConsultationCounts;
    }>("/api/consultations"),

    http.get<{
      data: Lawyer[];
    }>("/api/lawyers"),
  ]);

  return (
    <div className="container max-w-7xl space-y-6 py-10">
      <WelcomeText />

      <Stats
        activeCases={cases.data.counts.all}
        hasOffers={cases.data.counts.has_offers}
        upcomingConsultations={consultations.data.counts.upcoming}
      />

      <NeedHelp />

      <LegalServices />

      <RecentCases cases={cases.data.data} />

      <RecommendedLawyers recommendedLawyers={recommendedLawyers.data.data} />
    </div>
  );
}
