import Stats from "@/components/client-lawyer/client/dashboard/stats";
import WelcomeText from "@/components/client-lawyer/reusable/welcome-text";

export default function DashboardPage() {
  return (
    <div className="container max-w-5xl space-y-6">
      <WelcomeText />

      <Stats />
    </div>
  );
}
