"use client";

import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Counts } from "@/types/lawyer/consultations";

export default function Filters({ counts }: { counts: Counts }) {
  const t = useTranslations("Lawyer.Consultations.Bookings.Filters");

  const statusKeys: (keyof Counts)[] = [
    "all",
    "upcoming",
    "needs_new_time",
    "completed",
    "cancelled",
  ];

  const [filters, setFilters] = useQueryStates({
    status: parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  function getCount(key: keyof Counts) {
    switch (key) {
      case "all":
        return counts.all;
      case "cancelled":
        return counts.cancelled;
      case "completed":
        return counts.completed;
      case "needs_new_time":
        return counts.needs_new_time;
      case "upcoming":
        return counts.upcoming;
      default:
        return 0;
    }
  }

  return (
    <div>
      <Tabs
        value={filters.status}
        onValueChange={(value) => setFilters({ status: value, page: "1" })}
        className="w-full"
      >
        <TabsList className="p-0! bg-transparent gap-2 flex-wrap h-auto!">
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
              w-fit
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
