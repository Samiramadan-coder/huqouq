import { getTranslations } from "next-intl/server";
import Title from "../../reusable/title";
import Hint from "../../reusable/hint";
import AddNew from "../../reusable/add-new";

export default async function SectionTitle() {
  const t = await getTranslations("Client.LegalServices");
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Title>{t("title")}</Title>
        <Hint>{t("hint")}</Hint>
      </div>

      <AddNew href="/client/legal-services/create">{t("create")}</AddNew>
    </div>
  );
}
