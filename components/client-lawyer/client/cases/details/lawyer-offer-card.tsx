"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import AcceptOffer from "./accept-offer";
import { Button } from "@/components/ui/button";
import { CaseOffer } from "@/types/client/cases";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LawyerOfferCard({
  caseId,
  caseOffer,
}: {
  caseId: number;
  caseOffer: CaseOffer;
}) {
  console.log("Offer:", caseOffer);
  const locale = useLocale();
  const t = useTranslations("Client.Cases");
  const tCommon = useTranslations("Common");
  const fontClass = locale === "en" ? "font-lora" : "";
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <Card className="rounded-xs border border-secondary ring-0!">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-12">
              <AvatarImage
                src={caseOffer.lawyer.photo_url}
                alt={caseOffer.lawyer.name}
              />
              <AvatarFallback>{caseOffer.lawyer.name[0]}</AvatarFallback>
            </Avatar>
            <span className="bg-accent text-primary-foreground absolute -bottom-0.5 -inset-e-0.5 flex size-4 items-center justify-center rounded-full border border-white text-[8px]">
              O
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className={cn("text-sm font-semibold", fontClass)}>
                  {caseOffer.lawyer.name}
                </h3>
                <p className="mt-1 text-[11px] text-accent">
                  {caseOffer.lawyer.specializations.join(", ")}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className={cn("text-lg font-semibold", fontClass)}>
                  {tCommon("AED")} {caseOffer.amount}
                </p>
                <p className="text-[11px] text-primary/40">{t("fixedFee")}</p>
              </div>
            </div>

            {/* <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3.5 fill-accent text-accent"
                  />
                ))}
              </div>

              <span className="text-primary/50">4.9 (134 reviews)</span>
              <span className="text-secondary">·</span>
              <span className="text-primary/50">Responds within 2 hrs</span>
            </div> */}

            <p
              className={cn(
                "mt-4 text-sm leading-relaxed text-primary/65",
                !showFullMessage && "line-clamp-2",
              )}
            >
              {caseOffer.message}
            </p>

            <button
              type="button"
              className="mt-1 text-[11px] cursor-pointer text-accent hover:underline font-normal"
              onClick={() => setShowFullMessage(!showFullMessage)}
            >
              {showFullMessage ? t("readLess") : t("readMore")}
            </button>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AcceptOffer offer={caseOffer} caseId={caseId} />

                {/* <Button
                  variant="outline"
                  className="text-xs font-normal rounded-sm bg-transparent text-accent border-accent/40"
                >
                  <MessageSquare className="size-3.5" />
                  {t("message")}
                </Button> */}
              </div>

              <Button
                variant="ghost"
                className="px-0 text-primary/45 font-normal text-xs hover:bg-transparent"
              >
                {t("viewProfile")}
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
