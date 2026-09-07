import { cn } from "@/lib/utils";
import { Lock, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseDetails } from "@/types/client/cases";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AcceptedOffer({
  caseDetails,
}: {
  caseDetails: CaseDetails;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const tCommon = await getTranslations("Common");
  const fontClass = locale === "en" ? "font-lora" : "";

  if (!caseDetails.accepted_offer) {
    return null;
  }

  // Calculate the platform fee and the amount to pay the lawyer
  const platformFee = caseDetails.payment?.fee_percentage
    ? caseDetails.accepted_offer.amount *
      (caseDetails.payment.fee_percentage / 100)
    : 0;

  // Calculate the amount to pay the lawyer after deducting the platform fee
  const amountToPayLawyer = caseDetails.accepted_offer.amount - platformFee;

  return (
    <Card className="rounded-xs border border-secondary ring-0!">
      <CardContent>
        <p className={cn("text-sm font-semibold text-primary", fontClass)}>
          {t("yourHiredLawyer")}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 mt-4">
            <div className="relative shrink-0">
              <Avatar className="size-12">
                <AvatarImage
                  src={caseDetails.accepted_offer.lawyer.photo_url}
                  alt={caseDetails.accepted_offer.lawyer.name}
                />
                <AvatarFallback>
                  {caseDetails.accepted_offer.lawyer.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="bg-accent text-primary-foreground absolute -bottom-0.5 -inset-e-0.5 flex size-4 items-center justify-center rounded-full border border-white text-[8px]">
                O
              </span>
            </div>

            <div>
              <div>
                <h3 className={cn("text-sm font-semibold", fontClass)}>
                  {caseDetails.accepted_offer.lawyer.name}
                </h3>
                <p className="mt-1 text-[11px] text-accent">
                  {caseDetails.accepted_offer.lawyer.specializations.join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="shrink-0 text-right">
              <p className="text-xs mb-1 text-primary/40 uppercase">
                {t("agreedAmount")}
              </p>
              <p className={cn("text-lg font-semibold", fontClass)}>
                {tCommon("AED")} {caseDetails.accepted_offer.amount}
              </p>
            </div>
          </div>
        </div>

        {caseDetails.payment?.fee_percentage && caseDetails.accepted_offer && (
          <div className="p-4 border border-accent/40 rounded-sm bg-accent/10 mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-primary/70">
                {t("platformFee")} ({caseDetails.payment?.fee_percentage}%):{" "}
                <span
                  className={cn("font-bold text-primary text-base", fontClass)}
                >
                  {tCommon("AED")} {platformFee}
                </span>
              </p>
              <p className="font-sans text-[11px] text-primary/45 mb-3">
                {t("platformFeeDescription", {
                  percentage: caseDetails.payment?.fee_percentage,
                })}
              </p>
            </div>
            <Separator className="bg-accent/40" />
            <div className="space-y-2">
              <p className="text-sm text-primary/70">
                {t("amountForLawyer")}{" "}
                <span
                  className={cn("font-bold text-primary text-base", fontClass)}
                >
                  {tCommon("AED")} {amountToPayLawyer}
                </span>
              </p>
              <p className="font-sans text-[11px] text-primary/45 mb-3">
                {t("amountForLawyerDescription")}
              </p>
            </div>
          </div>
        )}

        <Button className="mt-4 w-full h-11 text-primary bg-accent hover:bg-accent hover:text-primary">
          {t("payNow")} ({tCommon("AED")} {platformFee})
          <MoveRight className="size-4 rtl:rotate-180" />
        </Button>

        <Button
          disabled={!caseDetails.chat_unlocked}
          className="text-xs mt-4 w-full h-11 text-primary bg-accent/20 hover:bg-accent/20 hover:text-primary"
        >
          <Lock className="size-4 rtl:rotate-180" />
          {t("chatUnlock")}
        </Button>
      </CardContent>
    </Card>
  );
}
