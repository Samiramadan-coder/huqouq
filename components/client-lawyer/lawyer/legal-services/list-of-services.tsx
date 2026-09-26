// import CaseCard from "./case-card";
import { Meta } from "@/types/shared";
import { getTranslations } from "next-intl/server";
// import ListOfCasesHeader from "./list-of-cases-header";
// import { Case, Filters } from "@/types/lawyer/browse-cases";
import PaginationTemplate from "../../reusable/pagination-template";
import { LegalService } from "@/types/lawyer/legal-services";
import { Clock, FileText, MapPin } from "lucide-react";
import UrgencyBadge from "../../reusable/urgency-label";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import ListOfLegalServicesHeader from "./list-of-legal-services-header";

export default async function ListOfLegalServices({
  services,
  pagination,
}: {
  services: LegalService[];
  pagination: Meta;
}) {
  const t = await getTranslations("Lawyer.LegalServices");

  return (
    <div className="space-y-3">
      <ListOfLegalServicesHeader total={pagination.total} />

      {services.length > 0 ? (
        <>
          {services.map((service) => (
            <div
              className="bg-white border border-secondary rounded-sm hover:border-accent/40 hover:shadow-sm transition-all duration-200"
              key={service.id}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-background border border-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="size-4 text-primary/50" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-sans text-xs font-semibold text-accent tracking-wide">
                        {service.service_type_label}
                      </span>
                      <UrgencyBadge
                        urgency={service.urgency}
                        urgency_label={service.urgency_label}
                      />
                    </div>
                    <p className="font-sans text-sm text-primary leading-relaxed line-clamp-2 mb-3">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1 font-sans text-xs text-primary/45">
                        <MapPin className="size-3 text-primary/45" />
                        {service.emirate}
                      </span>
                      <span className="flex items-center gap-1 font-sans text-xs text-primary/45">
                        <Clock className="size-3 text-primary/45" />
                        {formatDate(service.submitted_at)}
                      </span>
                      <span className="font-sans text-xs text-primary/45">
                        {service.offers_count} {t("offersSubmitted")}
                      </span>
                    </div>
                  </div>

                  <Link href={`/lawyer/services/${service.id}`}>
                    <Button className="text-sm font-semibold bg-accent hover:bg-accent/80 rounded-sm p-4 h-8 text-primary">
                      {t("view")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <PaginationTemplate
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        </>
      ) : (
        <p className="text-sm text-primary/50">{t("noCasesFound")}</p>
      )}
    </div>
  );
}
