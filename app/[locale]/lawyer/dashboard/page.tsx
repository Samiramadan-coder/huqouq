import Info from "@/components/client-lawyer/lawyer/dashboard/info";
import RecentCases from "@/components/client-lawyer/lawyer/dashboard/recent-cases";

export default async function Page() {
  return (
    <div className="container max-w-7xl mx-auto space-y-6 py-10">
      <Info />

      <RecentCases />
    </div>
  );
}
