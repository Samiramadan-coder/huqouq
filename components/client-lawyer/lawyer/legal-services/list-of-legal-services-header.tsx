"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { ListFilterPlus } from "lucide-react";
import FiltersControl from "./filters-control";
import { Button } from "@/components/ui/button";
import { Filters } from "@/types/lawyer/legal-services";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLawyerBrowseServicesFilters } from "@/providers/lawyer-browse-services-filters";

export default function ListOfLegalServicesHeader({
  total,
  filters,
}: {
  total: number;
  filters: Filters;
}) {
  const t = useTranslations("Lawyer.LegalServices");
  const { lawyerFilters, setLawyerFilters } = useLawyerBrowseServicesFilters();

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="text-xs text-primary/40 flex items-center gap-2">
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("filters")}>
                <ListFilterPlus aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="sr-only">{t("filters")}</SheetTitle>
              <div className="mt-14 px-2 pb-4 overflow-y-auto">
                <FiltersControl filters={filters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <span className="text-primary font-bold">{total}</span>{" "}
        {t("requestsAvailable")}
      </div>

      <Select
        value={lawyerFilters.sorts}
        onValueChange={(value) => setLawyerFilters({ sorts: value, page: "1" })}
      >
        <SelectTrigger
          aria-label={t("sortBy")}
          className="ms-auto border border-secondary w-full max-w-48 min-h-10 bg-white rounded-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.sorts.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
