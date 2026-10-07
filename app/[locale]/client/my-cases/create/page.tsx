import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Form from "@/components/client-lawyer/client/cases/form";

type SearchParams = {
  lawyerId?: string;
  specializations?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.Cases");

  return {
    title: `${t("createNew")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { lawyerId, specializations } = await searchParams;

  return <Form lawyerId={lawyerId} specializations={specializations} />;
}
