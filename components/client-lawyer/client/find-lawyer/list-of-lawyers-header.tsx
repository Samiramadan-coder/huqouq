"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  // SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Filters } from "@/types/lawyer/browse-cases";
import { useTranslations } from "next-intl";
import FiltersControl from "./filters-control";
import { Button } from "@/components/ui/button";
import { ListFilterPlus } from "lucide-react";
// import { useLawyerBrowseCasesFilters } from "@/providers/lawyer-browse-cases-filters";

export default function ListOfLawyersHeader({ total }: { total: number }) {
  const t = useTranslations("Client.FindLawyer");
  // const { lawyerFilters, setLawyerFilters } = useLawyerBrowseCasesFilters();

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="text-xs text-primary/40 flex items-center gap-2">
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ListFilterPlus />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-14 px-2">
                <FiltersControl />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <span className="text-primary font-bold">{total}</span>{" "}
        {t("lawyersFound")}
      </div>

      <Select
      // value={lawyerFilters.sorts}
      // onValueChange={(value) => setLawyerFilters({ sorts: value, page: "1" })}
      >
        <SelectTrigger className="ms-auto border border-secondary w-full max-w-48 min-h-10 bg-white rounded-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* {filters.sorts.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))} */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
