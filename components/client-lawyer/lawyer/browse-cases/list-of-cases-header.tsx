"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filters } from "@/types/lawyer/browse-cases";
import { useTranslations } from "next-intl";
import FiltersControl from "./filters-control";
import { Button } from "@/components/ui/button";
import { ListFilterPlus } from "lucide-react";

export default function ListOfCasesHeader({
  total,
  filters,
}: {
  total: number;
  filters: Filters;
}) {
  const t = useTranslations("Lawyer.BrowseCases");

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <p className="text-xs text-primary/40 flex items-center gap-2">
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ListFilterPlus />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-14 px-2">
                <FiltersControl filters={filters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {total} {t("MatchYourFilters")}
      </p>

      <Select>
        <SelectTrigger className="ms-auto border border-secondary w-full max-w-48 min-h-10 bg-white rounded-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="most_recent">{t("MostRecent")}</SelectItem>
            <SelectItem value="highest_budget">{t("HighestBudget")}</SelectItem>
            <SelectItem value="most_urgent">{t("MostUrgent")}</SelectItem>
            <SelectItem value="fewest_offers">{t("FewestOffers")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
