"use client";

import { useTranslations } from "next-intl";
import { Counts } from "@/types/lawyer/my-offers";
import { parseAsString, useQueryState } from "nuqs";
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
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <div className="overflow-x-auto">
      <Tabs value={status} onValueChange={setStatus}>
        <TabsList variant="line" className="h-auto!">
          {statusKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="h-9">
              {t(key)}
              <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
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
