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

export default function ListOfCasesHeader({ total }: { total: number }) {
  const t = useTranslations("Lawyer.BrowseCases");

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs text-primary/40">
        {total} {t("MatchYourFilters")}
      </p>

      <Select>
        <SelectTrigger className="border border-secondary w-full max-w-48 min-h-10 bg-white rounded-xs">
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
