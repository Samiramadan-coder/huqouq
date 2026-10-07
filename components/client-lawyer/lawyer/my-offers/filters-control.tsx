"use client";

import { useTranslations } from "next-intl";
import { Counts } from "@/types/lawyer/my-offers";
import { parseAsString, useQueryStates } from "nuqs";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusKeys: (keyof Counts)[] = [
  "all",
  "pending",
  "pending_fees",
  "accepted",
  "in_progress",
  "cancelled",
  "closed",
  "declined",
  "pending_closure",
  "withdrawn",
];

export default function FiltersControl({ counts }: { counts: Counts }) {
  const t = useTranslations("Lawyer.MyOffers");
  const [{ status }, setFilters] = useQueryStates({
    status: parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <div className="overflow-x-auto">
      <Tabs
        value={status}
        onValueChange={(value) => setFilters({ status: value, page: "1" })}
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
