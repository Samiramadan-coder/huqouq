"use client";

import {
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  useQueryStates,
} from "nuqs";
import { createContext, useContext, useTransition } from "react";

const filtersParsers = () => ({
  specialization_id: parseAsArrayOf(parseAsInteger)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  urgency: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  emirate: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  sort: parseAsString
    .withDefault("most_recent")
    .withOptions({ history: "push", shallow: false }),
  page: parseAsString
    .withDefault("1")
    .withOptions({ history: "push", shallow: false }),
  q: parseAsString
    .withDefault("")
    .withOptions({ history: "push", shallow: false }),
});

type LawyerBrowseCasesFiltersContextType = {
  lawyerFilters: ReturnType<
    typeof useQueryStates<ReturnType<typeof filtersParsers>>
  >[0];
  setLawyerFilters: ReturnType<
    typeof useQueryStates<ReturnType<typeof filtersParsers>>
  >[1];
  isPending: boolean;
};

const BrowseFiltersContext =
  createContext<LawyerBrowseCasesFiltersContextType | null>(null);

export function LawyerBrowseCasesFiltersProvider({
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

export function useLawyerBrowseCasesFilters() {
  const context = useContext(BrowseFiltersContext);

  if (!context) {
    throw new Error(
      "useLawyerBrowseCasesFilters must be used inside LawyerBrowseCasesFiltersProvider",
    );
  }

  return context;
}
