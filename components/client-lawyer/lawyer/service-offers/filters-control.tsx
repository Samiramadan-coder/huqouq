"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { Counts } from "@/types/lawyer/service-offers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusKeys: (keyof Counts)[] = ["all", "pending", "accepted", "rejected"];

export default function FiltersControl({ counts }: { counts: Counts }) {
  const t = useTranslations("Lawyer.ServiceOffers");
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <div className="overflow-x-auto">
      <Tabs value={status} onValueChange={setStatus}>
        <TabsList className="h-auto! bg-white rounded-sm p-1">
          {statusKeys.map((key) => {
            const active = status === key;

            return (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-sm h-9 px-4 shadow-none! data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {t(key)}
                <span
                  className={cn(
                    "ml-1 size-4.5 bg-background rounded-full text-primary/40 text-[11px] grid place-items-center",
                    active && "bg-white/20 text-white",
                  )}
                >
                  {counts[key]}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
