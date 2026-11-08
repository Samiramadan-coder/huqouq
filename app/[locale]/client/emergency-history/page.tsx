import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import { Emergency } from "@/types/client/emergency";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import DataPreview from "@/components/client-lawyer/client/emergency/data-preview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Client.EmergencyHistory");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page() {
  const t = await getTranslations("Client.EmergencyHistory");

  const { data } = await http.get<{
    data: Emergency[];
    meta: Meta;
  }>("/api/emergency/requests", {
    next: {
      tags: ["emergencies"],
    },
  });

  // console.log(data);
  // const { data: test } = await http.post(
  //   "/api/emergency/requests/37/continue",
  //   {
  //     answer: "no",
  //   },
  // );

  return (
    <div className="container py-10 max-w-7xl space-y-6">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Subtitle")}</Hint>
      </div>

      <DataPreview emergency={data.data} pagination={data.meta} />
    </div>
  );
}
