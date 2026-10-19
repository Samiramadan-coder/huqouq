import { Link } from "@/i18n/navigation";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function NeedHelp() {
  const t = await getTranslations("Client.Dashboard");

  return (
    <div>
      <h3 className="text-lg font-semibold ltr:font-lora text-primary mb-4">
        {t("needHelp")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-secondary hover:border-accent/40">
          <p className="text-base font-semibold ltr:font-lora text-primary mb-1.5">
            {t("bookConsultation")}
          </p>
          <p className="text-sm text-primary/50 mb-4 leading-relaxed">
            {t("bookConsultationDesc")}
          </p>
          <Link href="/client/find-lawyers">
            <Button
              variant="outline"
              className="border-secondary text-primary bg-transparent font-normal rounded-sm h-10 px-6"
            >
              {t("browseLawyers")}
              <MoveRight className="rtl:rotate-180" />
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-white border border-secondary hover:border-accent/40">
          <p className="text-base font-semibold ltr:font-lora text-primary mb-1.5">
            {t("emergencyLegalHelp")}
          </p>
          <p className="text-sm text-primary/50 mb-4 leading-relaxed">
            {t("emergencyLegalHelpDesc")}
          </p>
          <Button
            variant="outline"
            className="border-destructive/20 text-destructive bg-transparent font-normal rounded-sm h-10 px-6"
          >
            {t("requestNow")}
            <MoveRight className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
