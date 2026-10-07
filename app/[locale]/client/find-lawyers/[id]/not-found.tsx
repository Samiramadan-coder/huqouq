import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";

export default async function LawyerNotFound() {
  const t = await getTranslations("Client.FindLawyer");

  return (
    <div className="container max-w-5xl space-y-4 py-10">
      <Title>{t("lawyerNotFound")}</Title>

      <p className="text-sm text-primary/55">
        {t("lawyerNotFoundDescription")}
      </p>

      <Button asChild variant="outline" className="h-10 rounded-xs">
        <Link href="/client/find-lawyers">{t("backToFindLawyers")}</Link>
      </Button>
    </div>
  );
}
