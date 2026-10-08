import { Check, Mail, Paperclip, Phone } from "lucide-react";
import DownloadFile from "../../../reusable/download-file";
import { OfferStatus } from "../data-preview";
import { getLocale, getTranslations } from "next-intl/server";
import { ServiceDetails } from "@/types/lawyer/active-services";
import DeliverWork from "./deliver-work";
import Revisions from "./revisions";
import Deliveries from "./deliveries";
import { cookies } from "next/headers";
import ChatRoom from "./chat-room";

export default async function Index({ service }: { service: ServiceDetails }) {
  const locale = await getLocale();
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  const tCommon = await getTranslations("Common");
  const fontClass = locale === "en" ? "font-lora" : "";
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  const timeline = service.timeline ?? [];
  const revisions = service.revisions ?? [];
  const deliveries = service.deliveries ?? [];
  const attachments = service.attachments ?? [];
  const clientName = service.client?.name || service.client?.first_name || "";
  const doneSteps = timeline.filter((item) => item.state === "done").length;
  const progress =
    timeline.length > 1
      ? Math.min((doneSteps / (timeline.length - 1)) * 100, 100)
      : 0;
  // Only show a countdown while the work is still open
  const daysLabel =
    service.status === "completed" || service.days_remaining == null
      ? null
      : service.overdue || service.days_remaining < 0
        ? t("overdue", { days: Math.abs(service.days_remaining) })
        : t("daysRemaining", { days: service.days_remaining });

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="bg-white border border-secondary rounded-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h1 className={`text-lg font-semibold text-primary ${fontClass}`}>
              {service.service_type_label}
            </h1>

            <OfferStatus
              status={service.status}
              statusLabel={service.status_label}
            />
          </div>
          <p className="text-sm text-primary/50">
            {t("client")}: {clientName} · {tCommon("AED")} {service.agreed_fee}
            {daysLabel ? ` · ${daysLabel}` : ""}
          </p>
        </div>

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

        <div className="bg-white border border-secondary rounded-sm p-5">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-5">
            {t("statusTimeline")}
          </h2>

          <div className="overflow-x-auto">
            <ol className="relative flex min-w-120 items-start justify-between">
              <div
                aria-hidden="true"
                className="absolute inset-x-6 top-4 h-px bg-primary/20"
              >
                <div
                  className="h-full bg-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {timeline.map((item) => (
                <li
                  key={item.key}
                  aria-current={item.state === "current" ? "step" : undefined}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <div
                    className={`
                    flex size-8 items-center justify-center rounded-full border-2
                    ${
                      item.state === "done"
                        ? "border-accent bg-accent text-white"
                        : ""
                    }
                    ${
                      item.state === "current"
                        ? "border-accent bg-white ring-4 ring-accent/10"
                        : ""
                    }
                    ${item.state === "upcoming" ? "border-primary/15 bg-white" : ""}
                    ${item.state === "skipped" ? "border-gray-200 bg-gray-50" : ""}
                  `}
                  >
                    {item.state === "done" && (
                      <Check className="size-4" aria-hidden="true" />
                    )}
                    {item.state === "current" && (
                      <div className="size-2 rounded-full bg-accent" />
                    )}
                  </div>

                  <p
                    className={`
                    text-[10px] text-center leading-tight max-w-15
                    ${
                      item.state === "done"
                        ? "text-primary/55"
                        : item.state === "current"
                          ? "text-accent"
                          : "text-primary/30"
                    }
                  `}
                  >
                    {item.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {revisions.length > 0 ? <Revisions revisions={revisions} /> : null}

        {deliveries.length > 0 && token ? (
          <Deliveries deliveries={deliveries} token={token} />
        ) : null}

        {/* The API decides when work can still be delivered */}
        {(service.can?.deliver || service.can?.add_files) && (
          <DeliverWork serviceId={service.id} />
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
                className={`${fontClass} text-sm font-semibold text-primary`}
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

        <div className="bg-white border border-secondary rounded-sm p-5">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
            {t("serviceSummary")}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary/50">{t("type")}</span>
              <span className="text-xs font-semibold text-primary">
                {service.service_type_label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary/50">{t("agreedFee")}</span>
              <span className="text-sm font-bold text-primary">
                {tCommon("AED")} {service.agreed_fee}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary/50">
                {t("platformFee")}
              </span>
              <span className="text-xs text-primary/50">
                − {tCommon("AED")} {service.earnings?.platform_fee}
              </span>
            </div>
            <div className="h-px bg-[#F7F5F0]"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/60">
                {t("yourEarnings")}
              </span>
              <span className="text-sm font-bold text-accent">
                {tCommon("AED")} {service.earnings?.your_earnings}
              </span>
            </div>
          </div>
        </div>

        {daysLabel && (
          <div className="rounded-sm p-4 flex items-center gap-3 border bg-white border-secondary">
            <span className="text-sm font-medium text-primary/60">
              {daysLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
