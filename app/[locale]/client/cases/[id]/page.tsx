import {
  Tag,
  Eye,
  MapPin,
  FileText,
  CalendarDays,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getTranslations } from "next-intl/server";
import Title from "@/components/client-lawyer/reusable/title";
import BackBtn from "@/components/client-lawyer/reusable/back-btn";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="container max-w-3xl space-y-6">
      {/* Back To Cases */}
      <BackBtn>
        <span>{t("backToCases")}</span>
      </BackBtn>

      {/* Case Details */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <Title>Employment Contract Dispute</Title>
          <div className="space-x-2">
            <Button
              variant="outline"
              className="rounded-sm border-secondary font-normal text-xs text-primary/55"
            >
              {t("editCase")}
            </Button>
            <Button
              variant="outline"
              className="rounded-sm border-secondary font-normal text-xs text-destructive"
            >
              {t("closeCase")}
            </Button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Badge className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-2 h-6">
            {t("Filters.hasOffers")}
          </Badge>
          <Badge className="text-accent bg-accent/10 border border-accent/30 px-2.5 py-2 h-6 rounded-sm">
            {t("urgent")}
          </Badge>
          <div className="flex items-center gap-1">
            <Eye className="text-primary/35 size-3.5" />
            <span className="text-primary/35 text-xs">47 Views</span>
          </div>
        </div>
      </div>

      {/* Case Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-3 rounded-sm border-secondary">
          <CardContent></CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-sm border-secondary">
          <CardContent>
            <div className="flex items-center gap-1 mb-3">
              <FileText className="text-primary/40 size-3.5" />
              <span className={`text-sm font-semibold ${fontClass}`}>
                {t("Fields.description.label")}
              </span>
            </div>
            <p className="text-sm text-primary/65 leading-relaxed whitespace-pre-line">
              My employer terminated my contract without the required 30-day
              notice period and withheld my final salary and end-of-service
              gratuity. I have been working for the company for 4 years and am
              entitled to full EOSB under UAE Labor Law. The company claims I
              resigned, which is false — I have WhatsApp messages and email
              evidence to the contrary. I am seeking recovery of all dues and
              potential compensation for unlawful termination.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 rounded-sm border-secondary">
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Tag className="text-primary/40 size-3.5 relative top-1" />
              <div>
                <span className="uppercase text-xs text-primary/55">
                  {t("Fields.category.descLabel")}
                </span>
                <p className="mt-0.5">Labor Law</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="text-primary/40 size-3.5 relative top-1" />
              <div>
                <span className="uppercase text-xs text-primary/55">
                  {t("Fields.location.label")}
                </span>
                <p className="mt-0.5">Dubai</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarDays className="text-primary/40 size-3.5 relative top-1" />
              <div>
                <span className="uppercase text-xs text-primary/55">
                  {t("posted")}
                </span>
                <p className="mt-0.5">18 Jun 2025</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <TriangleAlert className="text-primary/40 size-3.5 relative top-1" />
              <div>
                <span className="uppercase text-xs text-primary/55">
                  {t("Fields.budget.label")}
                </span>
                <p className="mt-0.5">AED 500 - AED 1000</p>
              </div>
            </div>

            <Separator className="bg-secondary" />

            <BackBtn>
              <span className="text-xs">{t("backToCases")}</span>
            </BackBtn>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 rounded-sm border-secondary">
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
