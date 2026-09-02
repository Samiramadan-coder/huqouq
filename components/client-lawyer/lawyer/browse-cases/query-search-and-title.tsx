"use client";

import { useTranslations } from "next-intl";
import Title from "../../reusable/title";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function QuerySearchAndTitle() {
  const t = useTranslations("Lawyer.BrowseCases");

  return (
    <div className="flex items-center justify-between gap-4">
      <Title>{t("Title")}</Title>

      <InputGroup className="max-w-xs h-11 bg-white border border-secondary">
        <InputGroupInput
          placeholder={t("SearchPlaceholder")}
          className="placeholder:text-primary/35"
        />
        <InputGroupAddon>
          <Search className="text-primary/35" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
