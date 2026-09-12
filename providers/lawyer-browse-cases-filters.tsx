"use client";

import {
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  useQueryStates,
} from "nuqs";
import { createContext, useContext } from "react";

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
  sorts: parseAsString
    .withDefault("newest")
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
};

const BrowseFiltersContext =
  createContext<LawyerBrowseCasesFiltersContextType | null>(null);

export function LawyerBrowseCasesFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lawyerFilters, setLawyerFilters] = useQueryStates(filtersParsers());

  return (
    <BrowseFiltersContext.Provider value={{ lawyerFilters, setLawyerFilters }}>
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
