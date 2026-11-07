"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { Separator } from "@/components/ui/separator";
import { Counts } from "@/types/lawyer/emergency-history";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tab value (sent as `result`) -> the count shown next to it
const tabs: { value: string; count: keyof Counts }[] = [
  { value: "all", count: "total" },
  { value: "accepted", count: "accepted" },
  { value: "declined", count: "declined" },
  { value: "missed", count: "missed" },
];

export default function FiltersControl({ counts }: { counts: Counts }) {
  const t = useTranslations("Lawyer.EmergencyHistory.Tabs");
  const [{ result }, setFilters] = useQueryStates({
    result: parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <div className="overflow-x-auto">
      <Tabs
        value={result}
        onValueChange={(value) => setFilters({ result: value, page: "1" })}
      >
        <TabsList variant="line" className="h-auto!">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="h-9">
              {t(tab.value)}
              <span className="ms-1 h-4 min-w-4 px-1 bg-secondary rounded-full text-primary/40 text-[10px]">
                {counts[tab.count]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Separator className="bg-secondary" />
    </div>
  );
}
