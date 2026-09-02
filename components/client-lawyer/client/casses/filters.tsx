"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Counts } from "@/types/client/cases";

export default function Filters({ counts }: { counts: Counts }) {
  const t = useTranslations("Client.Cases.Filters");

  const statusKeys = [
    "all",
    "pending_review",
    "approved",
    "rejected",
    "has_offers",
    "hired",
    // "closed",
  ];

  const [status, setStatus] = useQueryState(
    "tab",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

  function getCount(key: string) {
    if (key === "all") {
      return counts.approved + counts.rejected + counts.pending_review;
    }

    if (key === "pending_review") {
      return counts.pending_review;
    }

    if (key === "approved") {
      return counts.approved;
    }

    if (key === "rejected") {
      return counts.rejected;
    }

    if (key === "has_offers") {
      return counts.has_offers;
    }

    if (key === "hired") {
      return counts.hired;
    }

    if (key === "closed") {
      return counts.closed;
    }

    return 0;
  }

  return (
    <Tabs value={status} onValueChange={setStatus} className="w-full">
      <TabsList className="p-0! bg-transparent gap-2">
        {statusKeys.map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="
              bg-white 
              px-3.5 
              font-normal 
              text-primary/55
              text-xs 
              rounded-sm 
              border 
              border-secondary
              data-[state=active]:bg-primary
              data-[state=active]:text-white
              data-[state=active]:border-primary
            "
          >
            {t(key)} ({getCount(key)})
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
