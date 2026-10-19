import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Form from "@/components/client-lawyer/client/legal-services/form";

type SearchParams = {
  type?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.LegalServices");

  return {
    title: `${t("create")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { type } = await searchParams;

  return <Form serviceType={type} />;
}
