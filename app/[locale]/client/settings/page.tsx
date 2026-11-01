import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Account from "@/components/client-lawyer/client/settings/account";
import DangerZone from "@/components/client-lawyer/client/settings/danger-zone";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.Settings");

  return {
    title: `${t("title")} | Huqouq`,
    robots: { index: false, follow: false },
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
