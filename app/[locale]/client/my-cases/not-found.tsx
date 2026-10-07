import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export default async function CaseNotFound() {
  const t = await getTranslations("Client.Cases");

  return (
    <div className="container max-w-3xl space-y-4 py-10">
      <Title>{t("caseNotFound")}</Title>

      <p className="text-sm text-primary/55">{t("caseNotFoundDescription")}</p>

      <Button asChild variant="outline" className="h-10 rounded-xs">
        <Link href="/client/my-cases">{t("backToCases")}</Link>
      </Button>
    </div>
  );
}
