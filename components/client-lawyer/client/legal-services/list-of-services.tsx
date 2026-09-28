import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { ArrowRight, CircleAlert, LucideFileText } from "lucide-react";
import { LegalService } from "@/types/client/legal-services";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function ListOfServices({
  services,
  pagination,
}: {
  services: LegalService[];
  pagination: Meta;
}) {
  const t = await getTranslations("Client.LegalServices");

  return (
    <div className="space-y-4">
      {services.length === 0 ? (
        <span className="text-primary/55">{t("noLegalServices")}</span>
      ) : (
        <>
          {services.map((service) => (
            <div
              key={service.id}
              className={cn(
                "border border-accent/30 bg-white",
                service.display_status === "delivered" && "border-amber-200",
              )}
            >
              <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="flex min-w-0 flex-[1_1_320px] items-center gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-secondary bg-background">
                    <LucideFileText className="size-4 text-accent" />
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold text-primary">
                      {service.service_type_label}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-primary/45">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <LegalServiceStatus
                    status={service.display_status}
                    statusLabel={service.display_status_label}
                  />

                  <span className="text-xs font-medium text-accent">
                    {service.offers_count} {t("offers")}
                  </span>

                  <span className="text-xs text-primary/30">
                    {formatDate(service.created_at)}
                  </span>

                  <Button
                    variant="ghost"
                    className="px-0 text-xs text-accent hover:bg-transparent hover:text-accent"
                    asChild
                  >
                    <Link href={`/client/legal-services/${service.id}`}>
                      <span>{t("view")}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>

                  {service.can_edit && (
                    <Button
                      variant="ghost"
                      className="px-0 text-xs text-primary hover:bg-transparent hover:text-accent"
                      asChild
                    >
                      <Link href={`/client/legal-services/edit/${service.id}`}>
                        <span>{t("editItem")}</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {service.display_status === "delivered" &&
                service.hired_lawyer && (
                  <div className="border-t border-amber-100 px-5 py-3 flex items-center gap-2">
                    <CircleAlert className="size-3 text-amber-600 shrink-0" />
                    <p className="font-sans text-xs text-amber-700 font-medium">
                      {t("deliveredLegalNotice", {
                        lawyerName: service.hired_lawyer?.name,
                      })}{" "}
                      <Link
                        href={`/client/legal-services/${service.id}`}
                        className="underline hover:no-underline"
                      >
                        <span>{t("reviewNow")}</span>
                      </Link>
                    </p>
                  </div>
                )}
            </div>
          ))}

          <PaginationTemplate
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        </>
      )}
    </div>
  );
}

export function LegalServiceStatus({
  status,
  statusLabel,
}: {
  status: LegalService["display_status"];
  statusLabel: string;
}) {
  switch (status) {
    case "pending_review":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-accent/30 bg-accent/5 text-accent">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-accent"></span>
          {statusLabel}
        </Badge>
      );

    case "approved":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-green-200 bg-green-50 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-700"></span>
          {statusLabel}
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-[#bee3f8] bg-[#EDF2F7] text-primary">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary"></span>
          {statusLabel}
        </Badge>
      );

    case "rejected":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-red-200 bg-red-50 text-red-700">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-700"></span>
          {statusLabel}
        </Badge>
      );

    case "has_offers":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-accent/25 bg-accent/8 text-accent">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-accent"></span>
          {statusLabel}
        </Badge>
      );

    case "delivered":
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-amber-200 bg-amber-50 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-amber-700"></span>
          {statusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-accent/30 bg-accent/5 text-accent">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-accent"></span>
          {statusLabel}
        </Badge>
      );
  }
}
