"use client";

import { parseAsString, parseAsArrayOf, useQueryStates } from "nuqs";
import { createContext, useContext, useTransition } from "react";

const filtersParsers = () => ({
  service_type: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  urgencies: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  emirates: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  sorts: parseAsString
    .withDefault("most_recent")
    .withOptions({ history: "push", shallow: false }),
  page: parseAsString
    .withDefault("1")
    .withOptions({ history: "push", shallow: false }),
  q: parseAsString
    .withDefault("")
    .withOptions({ history: "push", shallow: false }),
});

type LawyerBrowseServicesFiltersContextType = {
  lawyerFilters: ReturnType<
    typeof useQueryStates<ReturnType<typeof filtersParsers>>
  >[0];
  setLawyerFilters: ReturnType<
    typeof useQueryStates<ReturnType<typeof filtersParsers>>
  >[1];
  isPending: boolean;
};

const BrowseFiltersContext =
  createContext<LawyerBrowseServicesFiltersContextType | null>(null);

export function LawyerBrowseServicesFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [lawyerFilters, setLawyerFilters] = useQueryStates(filtersParsers(), {
    startTransition,
  });

  return (
    <BrowseFiltersContext.Provider
      value={{ lawyerFilters, setLawyerFilters, isPending }}
    >
      {children}
    </BrowseFiltersContext.Provider>
  );
}

export function useLawyerBrowseServicesFilters() {
  const context = useContext(BrowseFiltersContext);

  if (!context) {
    throw new Error(
      "useLawyerBrowseServicesFilters must be used inside LawyerBrowseServicesFiltersProvider",
    );
  }

  return context;
}
