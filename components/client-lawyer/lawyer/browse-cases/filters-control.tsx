"use client";

import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Filters } from "@/types/lawyer/browse-cases";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useLawyerBrowseCasesFilters } from "@/providers/lawyer-browse-cases-filters";

export default function FiltersControl({ filters }: { filters: Filters }) {
  const t = useTranslations("Lawyer.BrowseCases");
  const {
    filters: { specializations },
    setFilters,
  } = useLawyerBrowseCasesFilters();

  return (
    <Card className="rounded-sm ring-0! border border-secondary p-0 gap-0">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-primary/50 size-4" />
          <span className="text-primary text-xs font-semibold">
            {t("Filters")}
          </span>
        </div>

        <Button
          variant="ghost"
          className="p-0 text-xs font-semibold hover:text-accent hover:bg-transparent text-accent"
        >
          {t("ClearAll")}
        </Button>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("Specialization")}
        </p>
        <FieldGroup className="gap-3">
          {filters.specializations.map((spec) => (
            <Field key={spec.id} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`specialization-${spec.id}`}
                name={`specialization-${spec.id}`}
                checked={specializations.includes(spec.id)}
                onCheckedChange={(e) => {
                  const value = spec.id;
                  if (e) {
                    setFilters({
                      specializations: [...specializations, value],
                    });
                  } else {
                    setFilters({
                      specializations: specializations.filter(
                        (id) => id !== value,
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`specialization-${spec.id}`}
                className="text-xs text-primary font-medium"
              >
                {spec.name}{" "}
                {filters.my_specialization_ids.includes(spec.id) && (
                  <span className="uppercase text-accent text-[9px] font-semibold">
                    {t("YourSpecialization")}
                  </span>
                )}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>
    </Card>
  );
}
