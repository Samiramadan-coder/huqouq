import Stats from "@/components/client-lawyer/client/dashboard/stats";
import WelcomeText from "@/components/client-lawyer/reusable/welcome-text";
import NeedHelp from "@/components/client-lawyer/client/dashboard/need-help";

export default function DashboardPage() {
  return (
    <div className="container max-w-5xl space-y-6">
      <WelcomeText />

      <Stats />

      <NeedHelp />
    </div>
  );
}
