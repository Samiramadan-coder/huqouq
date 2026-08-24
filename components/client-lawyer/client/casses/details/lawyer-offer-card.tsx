import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getTranslations } from "next-intl/server";
import { ChevronRight, MessageSquare, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function LawyerOfferCard() {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const tCommon = await getTranslations("Common");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <Card className="rounded-sm border-secondary">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-12">
              <AvatarImage src="/images/lawyer.jpg" alt="Ahmad Al Rashidi" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <span className="bg-accent text-primary-foreground absolute -bottom-0.5 -inset-e-0.5 flex size-4 items-center justify-center rounded-full border border-white text-[8px]">
              O
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className={cn("text-sm font-semibold", fontClass)}>
                  Lawyer name goes here
                </h3>
                <p className="mt-1 text-[11px] text-accent">
                  specialization goes here
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className={cn("text-lg font-semibold", fontClass)}>
                  {tCommon("AED")} 1,200
                </p>
                <p className="text-[11px] text-primary/40">{t("fixedFee")}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
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
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-primary/65">
              Offer description goes here
            </p>

            <button
              type="button"
              className="mt-1 text-[11px] cursor-pointer text-accent hover:underline font-normal"
            >
              {t("readMore")}
            </button>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button className="text-xs font-normal rounded-sm">
                  {t("acceptOffer")}
                </Button>
                <Button
                  variant="outline"
                  className="text-xs font-normal rounded-sm bg-transparent text-accent border-accent/40"
                >
                  <MessageSquare className="size-3.5" />
                  {t("message")}
                </Button>
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
