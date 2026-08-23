import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations("Client.Cases");

  return (
    <div className="container max-w-3xl space-y-6">
      <div>
        <Title>{t("createNew")}</Title>
        <Hint>{t("createNewHint")}</Hint>
      </div>
    </div>
  );
}
