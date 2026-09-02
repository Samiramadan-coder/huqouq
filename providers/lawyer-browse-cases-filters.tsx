"use client";

import {
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  useQueryStates,
} from "nuqs";
import { createContext, useContext } from "react";

const filtersParsers = (initialSpecializations: number[] = []) => ({
  specializations: parseAsArrayOf(parseAsInteger)
    .withDefault(initialSpecializations)
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
  initialSpecializations,
}: {
  children: React.ReactNode;
  initialSpecializations: number[];
}) {
  const [lawyerFilters, setLawyerFilters] = useQueryStates(
    filtersParsers(initialSpecializations),
  );

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
