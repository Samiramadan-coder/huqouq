import ChatRoom from "./chat-room";
import DeadlineChip from "@/components/client-lawyer/reusable/deadline-chip";
import { cookies } from "next/headers";
import DeliverWork from "./deliver-work";
import EarningsCard from "./earnings-card";
import { OfferStatus } from "../data-preview";
import { getTranslations } from "next-intl/server";
import { getFormatters } from "@/lib/format.server";
import DownloadFile from "../../../reusable/download-file";
import { ServiceDetails } from "@/types/lawyer/active-services";
import { Mail, Paperclip, Phone, RotateCcw } from "lucide-react";
import ServiceProgress from "@/components/client-lawyer/reusable/service-progress";
import DeliveryHistory from "@/components/client-lawyer/reusable/delivery-history/delivery-history";

export default async function Index({ service }: { service: ServiceDetails }) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  const format = await getFormatters();
  const timeline = service.timeline ?? [];
  const revisions = service.revisions ?? [];
  const deliveries = service.deliveries ?? [];
  const attachments = service.attachments ?? [];
  const clientName = service.client?.name || service.client?.first_name || "";

  const latestDelivery = deliveries.reduce<(typeof deliveries)[number] | null>(
    (latest, d) =>
      !latest || new Date(d.delivered_at) > new Date(latest.delivered_at)
        ? d
        : latest,
    null,
  );
  // Revisions come ordered, and a revision always carries the client's note, so the last one is the pending request
  const latestRevision = revisions.at(-1);
  const isRevisionInProgress =
    service.status === "in_progress" && deliveries.length > 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="bg-white border border-secondary rounded-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h1 className={`text-lg font-semibold text-primary ltr:font-lora`}>
              {service.service_type_label}
            </h1>

            <OfferStatus
              status={service.status}
              statusLabel={service.status_label}
            />
          </div>

          <p className="text-sm text-primary/50">
            {t("client")}: {clientName} · {format.money(service.agreed_fee)}
          </p>

          {/* Only while the lawyer still owes a delivery */}
          {service.status === "in_progress" && service.deadline && (
            <div className="mt-2">
              <DeadlineChip
                viewer="lawyer"
                deadline={service.deadline}
                daysRemaining={service.days_remaining}
                className="text-accent"
              />
            </div>
          )}
        </div>

        {/* The client asked for changes on the latest round */}
        {isRevisionInProgress && latestRevision && (
          <div className="bg-amber-50 border border-amber-300 rounded-sm px-5 py-4 flex items-start gap-3">
            <RotateCcw
              className="size-4 text-amber-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">
                {t("revisionRequestedRound", {
                  round: format.number(revisions.length),
                })}
              </p>
              <p className="text-xs text-amber-700/70 mb-3">
                {t("requestedOn", {
                  date: format.date(latestRevision.requested_at),
                })}
              </p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-amber-700/70 mb-1.5">
                {t("clientRevisionNote")}
              </p>
              <p className="text-sm text-amber-950/80 leading-relaxed whitespace-pre-line wrap-break-word border-s-2 border-amber-400 ps-3">
                {latestRevision.note}
              </p>
            </div>
          </div>
        )}

        {service.description && (
          <div className="bg-white border border-secondary rounded-sm p-5">
            <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-2">
              {t("requestDetails")}
            </h2>
            <p className="text-sm text-primary leading-relaxed whitespace-pre-line wrap-break-word">
              {service.description}
            </p>
          </div>
        )}

        {attachments.length > 0 && token && (
          <div className="bg-white border border-secondary rounded-sm p-5">
            <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
              {t("clientDocuments")}
            </h2>
            <ul className="space-y-2">
              {attachments.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 border border-secondary rounded-sm px-4 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Paperclip
                      className="size-3 text-primary/40 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 truncate text-sm text-primary">
                      {file.name}
                    </span>
                    <span
                      className="shrink-0 text-xs text-primary/35"
                      dir="ltr"
                    >
                      {(file.size_bytes / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <DownloadFile id={file.id} token={token} name={file.name} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <ServiceProgress title={t("statusTimeline")} steps={timeline} />

        {deliveries.length > 0 && token ? (
          <div className="bg-white border border-secondary rounded-sm">
            <DeliveryHistory
              viewer="lawyer"
              token={token}
              deliveries={deliveries}
              revisions={revisions}
              awaitingReview={service.status === "delivered"}
              inPreparation={isRevisionInProgress}
            />
          </div>
        ) : null}

        {/* The API decides when work can still be delivered */}
        {service.status === "in_progress" && service.can?.deliver && (
          <DeliverWork
            serviceId={service.id}
            mode="deliver"
            isFirstRound={service.deliveries.length === 0}
            roundNumber={deliveries.length + 1}
          />
        )}

        {service.status === "delivered" && (
          <DeliverWork
            serviceId={service.id}
            mode="addFiles"
            deliveredAt={latestDelivery?.delivered_at ?? null}
            reviewDeadline={service.review_deadline}
            canAddFiles={!!service.can?.add_files}
          />
        )}

        {service.can?.open_chat && (
          <ChatRoom
            serviceId={`service-${service.id}`}
            clientName={clientName}
          />
        )}
      </div>

      <div className="w-full lg:w-70 shrink-0 lg:sticky lg:top-6 flex flex-col gap-4">
        <div className="bg-white border border-secondary rounded-sm p-5">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
            {t("client")}
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span
                className={`ltr:font-lora text-sm font-semibold text-primary`}
              >
                {clientName.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary wrap-break-word">
                {clientName}
              </p>
              <p className="text-xs text-primary/40">{service.emirate}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {service.client?.email && (
              <div className="flex items-center gap-2">
                <Mail
                  className="size-3 text-primary/30 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${service.client.email}`}
                  className="text-xs text-primary/60 break-all hover:underline"
                >
                  {service.client.email}
                </a>
              </div>
            )}
            {service.client?.phone && (
              <div className="flex items-center gap-2">
                <Phone
                  className="size-3 text-primary/30 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xs text-primary/60" dir="ltr">
                  {service.client.phone}
                </span>
              </div>
            )}
          </div>
        </div>

        {service.earnings && (
          <EarningsCard
            agreedFee={service.agreed_fee}
            earnings={service.earnings}
          />
        )}
      </div>
    </div>
  );
}
