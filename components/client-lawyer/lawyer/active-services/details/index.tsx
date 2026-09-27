import { Check, MapPin, User } from "lucide-react";
import { OfferStatus } from "../data-preview";
import { getLocale, getTranslations } from "next-intl/server";
import { ServiceDetails } from "@/types/lawyer/active-services";

export default async function Index({ service }: { service: ServiceDetails }) {
  const locale = await getLocale();
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Lawyer.ActiveServices.Details");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="bg-white border border-secondary rounded-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className={`text-lg font-semibold text-primary ${fontClass}`}>
              {service.service_type_label}
            </h2>

            <OfferStatus
              status={service.status}
              statusLabel={service.status_label}
            />
          </div>
          <p className="text-sm text-primary/50">
            {t("client")}: {service.client.name} · {tCommon("AED")}{" "}
            {service.agreed_fee} ·{" "}
            {t("daysRemaining", { days: service.days_remaining })}
          </p>
        </div>

        <div className="bg-white border border-secondary rounded-sm p-5">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-5">
            {t("statusTimeline")}
          </p>

          <div className="relative flex items-start justify-between">
            <div className="absolute left-6 right-6 top-4 h-px bg-primary/20">
              <div
                className="h-full bg-accent transition-all"
                style={{
                  width: `${
                    (service.timeline.filter((item) => item.state === "done")
                      .length /
                      (service.timeline.length - 1)) *
                    100
                  }%`,
                }}
              />
            </div>

            {service.timeline.map((item) => (
              <div
                key={item.key}
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
                  {item.state === "done" && <Check className="size-4" />}
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
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-70 shrink-0 sticky top-6 flex flex-col gap-4">
        <div className="bg-white border border-secondary rounded-sm p-5">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
            {t("client")}
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span
                className={`${fontClass} text-sm font-semibold text-primary`}
              >
                {service.client.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                {service.client.name}
              </p>
              <p className="text-xs text-primary/40">{service.emirate}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <User className="size-3 text-primary/30 shrink-0" />
              <span className="text-xs text-primary/60">-</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-3 text-primary/30 shrink-0" />
              <span className="text-xs text-primary/60">-</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-secondary rounded-sm p-5">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary/35 mb-3">
            {t("serviceSummary")}
          </p>
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
                − {tCommon("AED")} {service.earnings.platform_fee}
              </span>
            </div>
            <div className="h-px bg-[#F7F5F0]"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/60">
                {t("yourEarnings")}
              </span>
              <span className="text-sm font-bold text-accent">
                {tCommon("AED")} {service.earnings.your_earnings}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-sm p-4 flex items-center gap-3 border bg-white border-secondary">
          <span className="text-sm font-medium text-primary/60">
            {t("daysRemaining", { days: service.days_remaining })}
          </span>
        </div>
      </div>
    </div>
  );
}
