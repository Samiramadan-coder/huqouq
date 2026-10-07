import React from "react";
import OfferForm from "./offer-form";
import Title from "../../reusable/title";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import UrgencyBadge from "../../reusable/urgency-label";
import { CaseDetails } from "@/types/lawyer/browse-cases";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Calendar,
  CircleAlert,
  Lock,
  MapPin,
  MoveRight,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name: string) {
  const extension = name.includes(".") ? name.split(".").pop() : "";
  return extension ? extension.slice(0, 4).toUpperCase() : "FILE";
}

export default async function Details({
  caseDetails,
  hire = false,
  canSubmitOffer = true,
  submitOfferBlockedReason,
}: {
  caseDetails: CaseDetails;
  hire?: boolean;
  canSubmitOffer?: boolean;
  submitOfferBlockedReason?: string | null;
}) {
  const locale = await getLocale();
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.BrowseCases");
  const fontClass = locale === "en" ? "font-lora" : "";
  const { client } = caseDetails;
  const documents = caseDetails.documents ?? [];

  return (
    <div className="space-y-4">
      <div>
        <Title>{caseDetails.title}</Title>

        <div className="flex flex-wrap gap-2 mb-3 mt-1">
          <Badge className="h-6 bg-background text-[11px] text-primary/60 border border-secondary rounded-xs">
            {caseDetails.specialization.name}
          </Badge>
          <UrgencyBadge
            urgency={caseDetails.urgency}
            urgency_label={caseDetails.urgency_label}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-0 space-y-3 order-2 lg:order-1">
          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5">
              <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                {t("client")}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Avatar size="lg">
                  <AvatarImage
                    src={client.photo_url ?? undefined}
                    alt={client.first_name ?? ""}
                  />
                  <AvatarFallback>{client.first_name?.[0]}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="font-semibold wrap-break-word">
                    {client.first_name}
                    {client.contact_visible && client.city
                      ? " — " + client.city
                      : ""}
                  </p>
                  {client.contact_visible && (
                    <>
                      {client.email && (
                        <p className="text-xs text-primary/40 mt-0.5 break-all">
                          {client.email}
                        </p>
                      )}
                      {client.phone && (
                        <p className="text-xs text-primary/40 mt-0.5" dir="ltr">
                          {client.phone}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!client.contact_visible && (
                <div className="border border-secondary bg-background p-3 mt-4 flex items-center gap-2">
                  <Lock
                    className="size-4 shrink-0 text-primary/35"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-primary/35">
                    {t("contactInformationHidden")}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5">
              <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                {t("CaseDetails")}
              </p>
              <p className="text-sm font-medium text-primary/75 mt-3 whitespace-pre-line wrap-break-word">
                {caseDetails.description}
              </p>
            </div>
          </Card>

          {documents.length > 0 && (
            <Card className="p-0 rounded-xs ring-0! border border-secondary">
              <div className="p-5">
                <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                  {t("AttachedDocuments")}
                </p>

                <div className="flex flex-col gap-3 mt-3">
                  {documents.map((doc, index) => (
                    <React.Fragment key={doc.id}>
                      {index > 0 && <Separator className="bg-secondary" />}
                      <div className="flex items-center gap-4">
                        <div className="p-2 font-bold text-xs rounded-sm border border-destructive/20 bg-destructive/5 text-destructive">
                          {getFileExtension(doc.name)}
                        </div>
                        <div className="flex-1 min-w-0 flex gap-4 items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm text-primary truncate">
                              {doc.name}
                            </p>
                            <p
                              className="text-xs text-primary/40 mt-0.5"
                              dir="ltr"
                            >
                              {formatFileSize(doc.size_bytes)}
                            </p>
                          </div>

                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent mt-0.5 underline whitespace-nowrap"
                          >
                            {t("ViewDocument")}
                            <span className="sr-only">: {doc.name}</span>
                          </a>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Card className="p-0 rounded-xs bg-primary/4 ring-0! border border-primary/10">
            <div className="p-5 flex items-start gap-2">
              <Users
                className="text-primary/35 size-4 min-w-4"
                aria-hidden="true"
              />
              <p className="font-sans text-xs text-primary/55 leading-relaxed">
                {caseDetails.offers_count} {t("OffersSubmitted2")}
              </p>
            </div>
          </Card>

          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5">
              <div>
                <h2 className={`text-base text-primary font-bold ${fontClass}`}>
                  {t("SubmitOffer")}
                </h2>
                <p className="text-xs text-primary/45 mb-5 leading-relaxed">
                  {t("SubmitOfferDescription")}
                </p>
              </div>

              {canSubmitOffer ? (
                <OfferForm caseId={caseDetails.id} hire={hire} />
              ) : (
                <div
                  role="status"
                  className="flex items-center justify-between gap-4 flex-wrap text-[13px] px-4 py-3 border border-amber-200 bg-amber-50 text-amber-700"
                >
                  <div className="flex items-center gap-2">
                    <TriangleAlert
                      className="text-amber-700 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {submitOfferBlockedReason}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="ms-auto h-9 text-[13px] text-amber-700 border-amber-200 rounded-xs bg-transparent hover:text-amber-700 hover:bg-transparent"
                  >
                    <Link
                      href="/lawyer/profile"
                      className="flex items-center gap-2"
                    >
                      {t("CompleteProfile")}
                      <MoveRight
                        className="size-4 rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:w-75 space-y-4 order-1 lg:order-2">
          <Card className="p-0 rounded-xs ring-0! border border-secondary">
            <div className="p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-4">
                {t("CaseSummary")}
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Category")}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {caseDetails.specialization.name}
                  </p>
                </div>
                <Separator className="bg-secondary" />

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Location")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin
                      className="size-3 text-primary/35"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium text-primary">
                      {caseDetails.city}
                    </p>
                  </div>
                </div>
                <Separator className="bg-secondary" />

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Posted")}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar
                      className="size-3 text-primary/35"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium text-primary">
                      {formatDate(caseDetails.posted_at)}
                    </p>
                  </div>
                </div>
                <Separator className="bg-secondary" />

                {caseDetails.budget_min != null &&
                  caseDetails.budget_max != null && (
                    <>
                      <div>
                        <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                          {t("Budget")}
                        </p>
                        <p className="text-sm text-accent font-semibold mt-1">
                          {tCommon("AED")} {caseDetails.budget_min} -{" "}
                          {caseDetails.budget_max}
                        </p>
                      </div>
                      <Separator className="bg-secondary" />
                    </>
                  )}

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest mb-1">
                    {t("Urgency")}
                  </p>
                  <UrgencyBadge
                    urgency={caseDetails.urgency}
                    urgency_label={caseDetails.urgency_label}
                  />
                </div>
                <Separator className="bg-secondary" />

                <div>
                  <p className="text-[10px] text-primary/35 uppercase tracking-widest">
                    {t("Competition")}
                  </p>
                  <p className="text-sm text-primary/50 font-medium mt-1">
                    {caseDetails.offers_count} {t("OffersSubmitted")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-0 rounded-xs bg-primary/4 ring-0! border border-primary/10">
            <div className="p-5 flex items-start gap-2">
              <CircleAlert
                className="text-primary/35 size-4 min-w-4"
                aria-hidden="true"
              />

              <p className="font-sans text-xs text-primary/55 leading-relaxed">
                {t("Prop1")}{" "}
                <strong className="text-primary/70">{t("Prop2")}</strong>{" "}
                {t("Prop3")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
