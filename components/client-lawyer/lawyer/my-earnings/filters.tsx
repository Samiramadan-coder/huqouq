"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { Separator } from "@/components/ui/separator";
import type { Counts } from "@/types/lawyer/my-earnings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEarningFormatters } from "./use-earning-formatters";

const statusKeys: (keyof Counts)[] = [
  "all",
  "pending",
  "consultations",
  "legal_services",
  "paid",
  "ready",
];

export default function Filters({ counts }: { counts: Counts }) {
  const { count } = useEarningFormatters();
  const t = useTranslations("Lawyer.MyEarnings.Filters");
  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <div className="overflow-x-auto">
      <Tabs
        value={tab}
        onValueChange={(value) => setFilters({ tab: value, page: "1" })}
      >
        <TabsList variant="line" className="h-auto!">
          {statusKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="h-9">
              {t(key)}
              <span className="ms-1 h-4 min-w-4 px-1 bg-secondary rounded-full text-primary/40 text-[10px]">
                {count(counts[key])}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Separator className="bg-secondary" />
    </div>
  );
}
