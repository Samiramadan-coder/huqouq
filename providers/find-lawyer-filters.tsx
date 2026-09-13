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
  languages: parseAsArrayOf(parseAsString)
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
  availability: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  rating: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  q: parseAsString
    .withDefault("")
    .withOptions({ history: "push", shallow: false }),
});

type FindLawyerFiltersContextType = {
  lawyerFilters: ReturnType<
    typeof useQueryStates<ReturnType<typeof filtersParsers>>
  >[0];
  setLawyerFilters: ReturnType<
    typeof useQueryStates<ReturnType<typeof filtersParsers>>
  >[1];
};

const FindLawyerFiltersContext =
  createContext<FindLawyerFiltersContextType | null>(null);

export function FindLawyerFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lawyerFilters, setLawyerFilters] = useQueryStates(filtersParsers());

  return (
    <FindLawyerFiltersContext.Provider
      value={{ lawyerFilters, setLawyerFilters }}
    >
      {children}
    </FindLawyerFiltersContext.Provider>
  );
}

export function useFindLawyerFilters() {
  const context = useContext(FindLawyerFiltersContext);

  if (!context) {
    throw new Error(
      "useFindLawyerFilters must be used inside FindLawyerFiltersProvider",
    );
  }

  return context;
}
