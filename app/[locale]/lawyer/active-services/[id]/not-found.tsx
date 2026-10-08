import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export default async function ActiveServiceNotFound() {
  const t = await getTranslations("Lawyer.ActiveServices.Details");

  return (
    <div className="space-y-4 p-4 sm:p-6 py-10">
      <Title>{t("notFound")}</Title>

      <p className="text-sm text-primary/55">{t("notFoundDescription")}</p>

      <Button asChild variant="outline" className="h-10 rounded-xs">
        <Link href="/lawyer/active-services">{t("backToServices")}</Link>
      </Button>
    </div>
  );
}
