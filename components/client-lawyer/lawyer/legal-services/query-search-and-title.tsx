"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import Title from "../../reusable/title";
import { useTranslations } from "next-intl";
import { useDebouncedState } from "@/hook/use-debounced-state";
import { useLawyerBrowseServicesFilters } from "@/providers/lawyer-browse-services-filters";

export default function QuerySearchAndTitle() {
  const t = useTranslations("Lawyer.LegalServices");
  const { lawyerFilters, setLawyerFilters } = useLawyerBrowseServicesFilters();
  const [search, setSearch] = useDebouncedState(lawyerFilters.q, (q) =>
    setLawyerFilters({ q, page: "1" }),
  );

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <Title>{t("title")}</Title>

      <InputGroup className="ms-auto max-w-xs h-11 bg-white border border-secondary rounded-sm">
        <InputGroupInput
          type="search"
          aria-label={t("searchPlaceholder")}
          placeholder={t("searchPlaceholder")}
          className="placeholder:text-primary/35"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <Search className="text-primary/35" aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
