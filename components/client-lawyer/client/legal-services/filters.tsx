"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { Separator } from "@/components/ui/separator";
import { Counts } from "@/types/client/legal-services";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Filters({ counts }: { counts: Counts }) {
  const t = useTranslations("Client.LegalServices.Filters");

  const statusKeys: (keyof Counts)[] = [
    "all",
    "approved",
    "completed",
    "delivered",
    "has_offers",
    "in_progress",
    "pending_review",
    "rejected",
  ];

  const [filters, setFilters] = useQueryStates({
    tab: parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <div className="overflow-auto">
      <Tabs
        value={filters.tab}
        onValueChange={(value) => setFilters({ tab: value, page: "1" })}
      >
        <TabsList variant="line" className="h-auto!">
          {statusKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="h-9">
              {t(key)}
              <span className="ms-1 h-4 min-w-4 px-1 bg-secondary rounded-full text-primary/40 text-[10px]">
                {counts[key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Separator className="bg-secondary" />
    </div>
  );
}
