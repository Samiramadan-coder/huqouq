"use client";

import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Filters } from "@/types/lawyer/legal-services";
import UrgencyBadge from "../../reusable/urgency-label";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useLawyerBrowseServicesFilters } from "@/providers/lawyer-browse-services-filters";

export default function FiltersControl({ filters }: { filters: Filters }) {
  const t = useTranslations("Lawyer.LegalServices");
  const { lawyerFilters, setLawyerFilters } = useLawyerBrowseServicesFilters();

  return (
    <Card className="rounded-sm ring-0! border border-secondary p-0 gap-0">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-primary/50 size-4" />
          <span className="text-primary text-xs font-semibold">
            {t("filters")}
          </span>
        </div>

        <Button
          variant="ghost"
          className="p-0 text-xs font-semibold hover:text-accent hover:bg-transparent text-accent"
        >
          {t("clearAll")}
        </Button>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("serviceType")}
        </p>
        <FieldGroup className="gap-3">
          {filters.service_types.map((service) => (
            <Field key={service.value} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`service-type-${service.value}`}
                name={`service-type-${service.value}`}
                checked={lawyerFilters.service_type.includes(service.value)}
                onCheckedChange={(e) => {
                  const value = service.value;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      service_type: [...lawyerFilters.service_type, value],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      service_type: lawyerFilters.service_type.filter(
                        (id) => id !== value,
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`service-type-${service.value}`}
                className="text-xs text-primary font-medium truncate"
              >
                {service.label}{" "}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("urgency")}
        </p>
        <FieldGroup className="gap-3">
          {filters.urgencies.map((urgency) => (
            <Field key={urgency.value} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`urgency-${urgency.value}`}
                name={`urgency-${urgency.value}`}
                checked={lawyerFilters.urgencies.includes(urgency.value)}
                onCheckedChange={(e) => {
                  const value = urgency.value;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      urgencies: [...lawyerFilters.urgencies, value],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      urgencies: lawyerFilters.urgencies.filter(
                        (v) => v !== value,
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`urgency-${urgency.value}`}
                className="text-xs text-primary font-medium"
              >
                <UrgencyBadge
                  urgency={urgency.value}
                  urgency_label={urgency.label}
                />
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("location")}
        </p>
        <FieldGroup className="gap-3">
          {filters.emirates.map((emirate) => (
            <Field key={emirate} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`emirate-${emirate}`}
                name={`emirate-${emirate}`}
                checked={lawyerFilters.emirates.includes(emirate)}
                onCheckedChange={(e) => {
                  const value = emirate;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      emirates: [...lawyerFilters.emirates, value],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      emirates: lawyerFilters.emirates.filter(
                        (v) => v !== value,
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`emirate-${emirate}`}
                className="text-xs text-primary font-medium"
              >
                {emirate}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>
    </Card>
  );
}
