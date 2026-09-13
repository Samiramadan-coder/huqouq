"use client";

import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Filters } from "@/types/client/find-lawyer";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useFindLawyerFilters } from "@/providers/find-lawyer-filters";

export default function FiltersControl({ filters }: { filters: Filters }) {
  const t = useTranslations("Client.FindLawyer");
  const { lawyerFilters, setLawyerFilters } = useFindLawyerFilters();

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
          {t("specialization")}
        </p>
        <FieldGroup className="gap-3">
          {filters.specializations.map((spec) => (
            <Field key={spec.id} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`specialization-${spec.id}`}
                name={`specialization-${spec.id}`}
                checked={lawyerFilters.specialization_id.includes(spec.id)}
                onCheckedChange={(e) => {
                  const value = spec.id;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      specialization_id: [
                        ...lawyerFilters.specialization_id,
                        value,
                      ],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      specialization_id: lawyerFilters.specialization_id.filter(
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
                {spec.name}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("emirates")}
        </p>
        <FieldGroup className="gap-3">
          {filters.emirates.map((emirate) => (
            <Field key={emirate} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`emirate-${emirate}`}
                name={`emirate-${emirate}`}
                checked={lawyerFilters.emirate.includes(emirate)}
                onCheckedChange={(e) => {
                  const value = emirate;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      emirate: [...lawyerFilters.emirate, value],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      emirate: lawyerFilters.emirate.filter((v) => v !== value),
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

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("languages")}
        </p>
        <FieldGroup className="gap-3">
          {filters.languages.map((language) => (
            <Field key={language} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`language-${language}`}
                name={`language-${language}`}
                checked={lawyerFilters.languages.includes(language)}
                onCheckedChange={(e) => {
                  const value = language;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      languages: [...lawyerFilters.languages, value],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      languages: lawyerFilters.languages.filter(
                        (v) => v !== value,
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`language-${language}`}
                className="text-xs text-primary font-medium"
              >
                {language}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("ratings")}
        </p>
        <FieldGroup className="gap-3">
          {filters.ratings.map((rating) => (
            <Field key={rating.value} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`rating-${rating.value}`}
                name={`rating-${rating.value}`}
                checked={lawyerFilters.rating.includes(rating.value.toString())}
                onCheckedChange={(e) => {
                  const value = rating.value;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      rating: [...lawyerFilters.rating, value.toString()],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      rating: lawyerFilters.rating.filter(
                        (v) => v !== value.toString(),
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`rating-${rating.value}`}
                className="text-xs text-primary font-medium"
              >
                {rating.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>

      <Separator className="bg-secondary" />

      <div className="px-4 py-3">
        <p className="text-primary/40 text-[10px] uppercase font-semibold mb-4">
          {t("availability")}
        </p>
        <FieldGroup className="gap-3">
          {filters.availability.map((availability) => (
            <Field key={availability.value} orientation="horizontal">
              <Checkbox
                className="rounded-xs"
                id={`availability-${availability.value}`}
                name={`availability-${availability.value}`}
                checked={lawyerFilters.availability.includes(
                  availability.value,
                )}
                onCheckedChange={(e) => {
                  const value = availability.value;
                  if (e) {
                    setLawyerFilters({
                      page: "1",
                      availability: [...lawyerFilters.availability, value],
                    });
                  } else {
                    setLawyerFilters({
                      page: "1",
                      availability: lawyerFilters.availability.filter(
                        (v) => v !== value,
                      ),
                    });
                  }
                }}
              />
              <FieldLabel
                htmlFor={`availability-${availability.value}`}
                className="text-xs text-primary font-medium"
              >
                {availability.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </div>
    </Card>
  );
}
