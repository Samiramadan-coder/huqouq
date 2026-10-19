"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileText, MoveRight, Scale } from "lucide-react";
import { useReferenceData } from "@/providers/reference-data.provider";
import { Badge } from "@/components/ui/badge";

export default function LegalServices() {
  const { referenceData } = useReferenceData();
  const t = useTranslations("Client.Dashboard");

  return (
    <div>
      <h3 className="text-lg font-semibold text-primary mb-4 ltr:font-lora">
        {t("legalServices")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-accent/5 border border-accent/40">
          <div className="size-10 bg-accent/15 mb-3 grid place-content-center">
            <Scale className="size-4 text-accent" />
          </div>
          <p className="text-base font-semibold text-primary mb-1.5 ltr:font-lora">
            {t("requestLegalService")}
          </p>
          <p className="text-sm text-primary/50 mb-4 leading-relaxed">
            {t("requestLegalServiceDesc")}
          </p>
          <Link href="/client/legal-services/create">
            <Button
              variant="ghost"
              className="text-accent bg-transparent hover:bg-transparent hover:text-accent font-normal h-10 px-0"
            >
              {t("requestNow")}
              <MoveRight className="rtl:rotate-180" />
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-white border border-secondary hover:border-accent/40">
          <div className="flex gap-4">
            <div className="size-10 bg-background mb-3 grid place-content-center">
              <FileText className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-primary mb-1.5 ltr:font-lora">
                {t("activeRequestCount")}
              </p>
              <p className="text-sm text-primary/50 mb-4 leading-relaxed">
                {t("activeRequest")}
              </p>
            </div>
          </div>
          <Link href="/client/legal-services">
            <Button
              variant="outline"
              className="border-secondary text-primary bg-transparent font-normal rounded-sm h-10 px-6"
            >
              {t("viewAll")}
              <MoveRight className="rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {referenceData?.legal_service_types.map((type) => (
          <Link
            href={`/client/legal-services/create?type=${type.value}`}
            key={type.value}
          >
            <Badge className="rounded-xs py-3 font-normal text-primary/60 border-secondary bg-white">
              {type.label}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
