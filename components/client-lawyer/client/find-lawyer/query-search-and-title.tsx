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

export default function QuerySearchAndTitle() {
  const t = useTranslations("Client.FindLawyer");

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
        />
        <InputGroupAddon>
          <Search className="text-primary/35" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
