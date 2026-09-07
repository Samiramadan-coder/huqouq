"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Counts } from "@/types/client/cases";

export default function Filters({ counts }: { counts: Counts }) {
  const t = useTranslations("Client.Cases.Filters");

  const statusKeys: (keyof Counts)[] = [
    "all",
    "pending_review",
    "in_progress",
    "published",
    "pending_fees",
    "has_offers",
    "hired",
    "pending_closure",
    "closed",
    "rejected",
  ];

  const [status, setStatus] = useQueryState(
    "tab",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

  function getCount(key: keyof Counts) {
    switch (key) {
      case "all":
        return counts.all;
      case "pending_review":
        return counts.pending_review;
      case "pending_closure":
        return counts.pending_closure;
      case "in_progress":
        return counts.in_progress;
      case "published":
        return counts.published;
      case "pending_fees":
        return counts.pending_fees;
      case "has_offers":
        return counts.has_offers;
      case "hired":
        return counts.hired;
      case "closed":
        return counts.closed;
      case "rejected":
        return counts.rejected;
      default:
        return 0;
    }
  }

  return (
    <div>
      <Tabs value={status} onValueChange={setStatus} className="w-full">
        <TabsList className="p-0! bg-transparent gap-0.5 flex-wrap h-auto!">
          {statusKeys.map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="
              bg-white 
              px-3.5 
              min-h-7
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
    </div>
  );
}
