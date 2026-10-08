import OfferForm from "./offer-form";
import { cookies } from "next/headers";
import { cn, formatDate } from "@/lib/utils";
import DownloadFile from "../../reusable/download-file";
import { getTranslations } from "next-intl/server";
import UrgencyBadge from "../../reusable/urgency-label";
import { OfferStatus } from "../service-offers/data-preview";
import { Clock, FileText, MapPin, Paperclip } from "lucide-react";
import { LegalServiceDetails } from "@/types/lawyer/legal-services";

export default async function Details({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  const t = await getTranslations("Lawyer.LegalServices");
  const tCommon = await getTranslations("Common");
  const attachments = service.attachments ?? [];
  const offer = service.my_offer;
  const showOfferForm = service.can.submit_offer || service.can.edit_offer;

  return (
    <>
      {service.my_offer && (
        <div
          className={cn(
            "bg-white border border-secondary rounded-sm p-5 mb-5 space-y-3",
            service.my_offer.status === "rejected" &&
              "bg-red-50 border-red-200",
            service.my_offer.status === "pending" &&
              "bg-amber-50 border-amber-200",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35">
              {t("offerStatus")}
            </p>
            <OfferStatus
              status={service.my_offer.status}
              statusLabel={service.my_offer.status_label}
            />
          </div>

          {/* The lawyer's own offer, so it can be reviewed without editing */}
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-xs text-primary/40">
                {t("Details.OfferForm.fee.label")}
              </dt>
              <dd className="font-semibold text-primary">
                {tCommon("AED")} {service.my_offer.fee}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-primary/40">
                {t("Details.OfferForm.delivery_time.label")}
              </dt>
              <dd className="font-semibold text-primary">
                {service.my_offer.delivery_time_label}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-primary/70 leading-relaxed whitespace-pre-line wrap-break-word">
            {service.my_offer.message}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="bg-white border border-secondary rounded-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="min-w-11 h-11 rounded-sm bg-background border border-secondary flex items-center justify-center shrink-0">
                <FileText
                  className="size-5 text-primary/50"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-sm font-semibold text-accent tracking-wide">
                    {service.service_type_label}
                  </h1>
                  <UrgencyBadge
                    urgency={service.urgency}
                    urgency_label={service.urgency_label}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-primary/45">
                    <MapPin
                      className="size-3 text-primary/40"
                      aria-hidden="true"
                    />
                    {service.emirate}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary/45">
                    <Clock
                      className="size-3 text-primary/40"
                      aria-hidden="true"
                    />
                    {formatDate(service.submitted_at)}
                  </span>
                  <span className="text-xs text-primary/45">
                    {service.offers_count} {t("offersSubmitted")}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
              {t("Details.requestDetails")}
            </p>
            <p className="text-sm text-primary leading-relaxed whitespace-pre-line wrap-break-word">
              {service.description}
            </p>
          </div>

          <div className="bg-white border border-secondary rounded-sm p-5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
              {t("Details.client")}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {service.client?.first_name?.slice(0, 1)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary">
                  {service.client?.first_name} ({t("Details.firstNameOnly")})
                </p>
                <p className="text-xs text-primary/40">
                  {service.emirate} · {t("Details.contactDetailsHidden")}
                </p>
              </div>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="bg-white border border-secondary rounded-sm p-5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
                {t("Details.clientDocuments")}
              </p>

              <div className="space-y-2">
                {attachments.map((attach) => (
                  <div className="flex flex-col gap-2" key={attach.id}>
                    <div className="flex items-center justify-between gap-3 bg-background border border-secondary rounded-sm px-4 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Paperclip
                          className="size-3 text-primary/40 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 truncate text-sm text-primary">
                          {attach.name}
                        </span>
                        <span
                          className="shrink-0 text-xs text-primary/35"
                          dir="ltr"
                        >
                          {(attach.size_bytes / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      {token && (
                        <DownloadFile
                          id={attach.id}
                          token={token}
                          name={attach.name}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showOfferForm && (
          <div className="w-full lg:w-85 shrink-0 lg:sticky lg:top-6 flex flex-col gap-4">
            <div className="bg-white border border-secondary rounded-sm overflow-hidden">
              <div className="bg-primary px-5 py-3.5">
                <h2 className="text-sm font-semibold text-white">
                  {service.can.edit_offer && offer
                    ? t("Details.editOffer")
                    : t("Details.submitOffer")}
                </h2>
              </div>
              <OfferForm
                // Remount with fresh defaults once the saved offer changes
                key={offer?.updated_at ?? "new"}
                serviceId={service.id}
                offer={service.can.edit_offer ? offer : null}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
