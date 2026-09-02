"use client";

import {
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  useQueryStates,
} from "nuqs";
import { createContext, useContext } from "react";

const filtersParsers = {
  specializations: parseAsArrayOf(parseAsInteger)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  q: parseAsString
    .withDefault("")
    .withOptions({ history: "push", shallow: false }),
};

type LawyerBrowseCasesFiltersContextType = {
  filters: ReturnType<typeof useQueryStates<typeof filtersParsers>>[0];
  setFilters: ReturnType<typeof useQueryStates<typeof filtersParsers>>[1];
};

const BrowseFiltersContext =
  createContext<LawyerBrowseCasesFiltersContextType | null>(null);

export function LawyerBrowseCasesFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useQueryStates(filtersParsers);

  return (
    <BrowseFiltersContext.Provider value={{ filters, setFilters }}>
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
