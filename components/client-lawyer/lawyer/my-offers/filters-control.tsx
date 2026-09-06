"use client";

import { useTranslations } from "next-intl";
import { Counts } from "@/types/lawyer/my-offers";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsString, useQueryState } from "nuqs";

export default function FiltersControl({ counts }: { counts: Counts }) {
  const t = useTranslations("Lawyer.MyOffers");
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <div>
      <Tabs value={status} onValueChange={setStatus}>
        <TabsList variant="line" className="h-auto!">
          <TabsTrigger
            value="all"
            className="h-8 data-[state=active]:after:border-primary"
          >
            {t("All")}
            <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
              {counts.all}
            </span>
          </TabsTrigger>

          <TabsTrigger value="pending" className="h-8">
            {t("Pending")}
            <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
              {counts.pending}
            </span>
          </TabsTrigger>

          <TabsTrigger value="cancelled" className="h-8">
            {t("Cancelled")}
            <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
              {counts.cancelled}
            </span>
          </TabsTrigger>

          <TabsTrigger value="accepted" className="h-8">
            {t("Accepted")}
            <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
              {counts.accepted}
            </span>
          </TabsTrigger>

          <TabsTrigger value="declined" className="h-8">
            {t("Declined")}
            <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
              {counts.declined}
            </span>
          </TabsTrigger>

          <TabsTrigger value="withdrawn" className="h-8">
            {t("Withdrawn")}
            <span className="ml-1 size-4 bg-secondary rounded-full text-primary/40 text-[10px]">
              {counts.withdrawn}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator className="bg-secondary" />
    </div>
  );
}
