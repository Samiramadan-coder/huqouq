"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslations } from "next-intl";
import Title from "../../reusable/title";
import { Search } from "lucide-react";
import { useLawyerBrowseCasesFilters } from "@/providers/lawyer-browse-cases-filters";

export default function QuerySearchAndTitle() {
  const t = useTranslations("Lawyer.BrowseCases");
  const {
    filters: { q },
    setFilters,
  } = useLawyerBrowseCasesFilters();

  return (
    <div className="flex items-center justify-between gap-4">
      <Title>{t("Title")}</Title>

      <InputGroup className="max-w-xs h-11 bg-white border border-secondary rounded-sm">
        <InputGroupInput
          placeholder={t("SearchPlaceholder")}
          className="placeholder:text-primary/35"
          value={q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
        <InputGroupAddon>
          <Search className="text-primary/35" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
