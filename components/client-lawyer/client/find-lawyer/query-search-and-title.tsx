"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import Hint from "../../reusable/hint";
import Title from "../../reusable/title";
import { useTranslations } from "next-intl";
import { useFindLawyerFilters } from "@/providers/find-lawyer-filters";
import { useDebouncedState } from "@/hook/use-debounced-state";

export default function QuerySearchAndTitle() {
  const t = useTranslations("Client.FindLawyer");
  const { lawyerFilters, setLawyerFilters } = useFindLawyerFilters();
  const [search, setSearch] = useDebouncedState(lawyerFilters.q, (q) =>
    setLawyerFilters({ q, page: "1" }),
  );

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <Title>{t("findLawyer")}</Title>
        <Hint>{t("findLawyerDescription")}</Hint>
      </div>

      <InputGroup className="ms-auto max-w-xs h-11 bg-white border border-secondary rounded-sm">
        <InputGroupInput
          placeholder={t("searchPlaceholder")}
          className="placeholder:text-primary/35"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon>
          <Search className="text-primary/35" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
