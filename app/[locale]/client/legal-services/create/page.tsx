import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Form from "@/components/client-lawyer/client/legal-services/form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.LegalServices");

  return {
    title: `${t("create")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <Form />;
}
