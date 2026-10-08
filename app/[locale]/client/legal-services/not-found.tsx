import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export default async function LegalServiceNotFound() {
  const t = await getTranslations("Client.LegalServices");

  return (
    <div className="container max-w-3xl space-y-4 py-10">
      <Title>{t("notFound")}</Title>

      <p className="text-sm text-primary/55">{t("notFoundDescription")}</p>

      <Button asChild variant="outline" className="h-10 rounded-xs">
        <Link href="/client/legal-services">{t("backToLegal")}</Link>
      </Button>
    </div>
  );
}
