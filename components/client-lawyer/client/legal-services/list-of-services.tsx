import { LegalService } from "@/types/client/legal-services";
import { Meta } from "@/types/shared";
import { LucideFileText } from "lucide-react";
import PaginationTemplate from "../../reusable/pagination-template";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";

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
              className="bg-white px-5 py-4 border border-accent/30 flex items-center gap-4"
            >
              <div className="flex-1 flex items-center gap-4">
                <div className="w-9 h-9 rounded-sm bg-background border border-secondary flex items-center justify-center shrink-0">
                  <LucideFileText className="size-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">
                    {service.service_type_label}
                  </p>
                  <p className="text-xs text-primary/45 mt-0.5 truncate max-w-sm">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <ServiceStatus
                  status={service.display_status}
                  statusLabel={service.display_status_label}
                />
                <span className="text-xs text-accent font-medium">
                  {service.offers_count} {t("offers")}
                </span>
                <span className="text-xs text-primary/30">
                  {formatDate(service.created_at)}
                </span>
              </div>
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

function ServiceStatus({
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
          {statusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-xs text-xs py-3 font-normal border-accent/30 bg-accent/5 text-accent">
          {statusLabel}
        </Badge>
      );
  }
}
