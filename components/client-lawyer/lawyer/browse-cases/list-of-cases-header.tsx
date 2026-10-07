"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filters } from "@/types/lawyer/browse-cases";
import { useTranslations } from "next-intl";
import FiltersControl from "./filters-control";
import { Button } from "@/components/ui/button";
import { ListFilterPlus } from "lucide-react";
import { useLawyerBrowseCasesFilters } from "@/providers/lawyer-browse-cases-filters";

export default function ListOfCasesHeader({
  total,
  filters,
}: {
  total: number;
  filters: Filters;
}) {
  const t = useTranslations("Lawyer.BrowseCases");
  const { lawyerFilters, setLawyerFilters } = useLawyerBrowseCasesFilters();

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="text-xs text-primary/40 flex items-center gap-2">
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("Filters")}>
                <ListFilterPlus aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="sr-only">{t("Filters")}</SheetTitle>
              <div className="mt-14 px-2 overflow-y-auto">
                <FiltersControl filters={filters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <span className="text-primary font-bold">{total}</span>{" "}
        {t("MatchYourFilters")}
      </div>

      <Select
        value={lawyerFilters.sort}
        onValueChange={(value) => setLawyerFilters({ sort: value, page: "1" })}
      >
        <SelectTrigger
          aria-label={t("SortBy")}
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
