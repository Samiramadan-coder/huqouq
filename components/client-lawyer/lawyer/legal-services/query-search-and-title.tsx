"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslations } from "next-intl";
import Title from "../../reusable/title";
import { Search } from "lucide-react";
// import { useLawyerBrowseCasesFilters } from "@/providers/lawyer-browse-cases-filters";
// import { useDebouncedState } from "@/hook/use-debounced-state";

export default function QuerySearchAndTitle() {
  const t = useTranslations("Lawyer.LegalServices");
  // const { lawyerFilters, setLawyerFilters } = useLawyerBrowseCasesFilters();
  // const [search, setSearch] = useDebouncedState(lawyerFilters.q, (q) =>
  //   setLawyerFilters({ q }),
  // );

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <Title>{t("title")}</Title>

      <InputGroup className="ms-auto max-w-xs h-11 bg-white border border-secondary rounded-sm">
        <InputGroupInput
          placeholder={t("searchPlaceholder")}
          className="placeholder:text-primary/35"
          // value={search}
          // onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <Search className="text-primary/35" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
