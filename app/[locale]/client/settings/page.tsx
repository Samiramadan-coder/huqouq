import Account from "@/components/client-lawyer/client/settings/account";
import DangerZone from "@/components/client-lawyer/client/settings/danger-zone";

export async function generateMetadata() {
  return {
    title: "Settings",
  };
}

export default function Page() {
  return (
    <div className="container max-w-3xl py-10 space-y-6">
      {/* Account */}
      <Account />

      {/* Danger zone */}
      <DangerZone />
    </div>
  );
}
