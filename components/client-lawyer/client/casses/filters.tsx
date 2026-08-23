"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsString, useQueryState } from "nuqs";

export default function Filters() {
  const t = useTranslations("Client.Cases.Filters");

  const statusKeys = [
    "all",
    "pending",
    "published",
    "hasOffers",
    "hired",
    "closed",
  ];

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

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
            {t(key)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
