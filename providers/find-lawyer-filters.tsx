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
  language: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  emirate: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  sort: parseAsString
    .withDefault("top_rated")
    .withOptions({ history: "push", shallow: false }),
  page: parseAsString
    .withDefault("1")
    .withOptions({ history: "push", shallow: false }),
  availability: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ history: "push", shallow: false }),
  min_rating: parseAsArrayOf(parseAsString)
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
  isPending: boolean;
};

const FindLawyerFiltersContext =
  createContext<FindLawyerFiltersContextType | null>(null);

export function FindLawyerFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [lawyerFilters, setLawyerFilters] = useQueryStates(filtersParsers(), {
    startTransition,
  });

  return (
    <FindLawyerFiltersContext.Provider
      value={{ lawyerFilters, setLawyerFilters, isPending }}
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
