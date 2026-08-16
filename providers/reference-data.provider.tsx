"use client";

import { User } from "@/types/shared";
import { createContext, useContext, useState, type ReactNode } from "react";

type ReferenceDataContext = {
  referenceData: User | null;
};

const ReferenceDataContext = createContext<ReferenceDataContext | null>(null);

export function ReferenceDataProvider({
  initialReferenceData,
  children,
}: {
  initialReferenceData: User | null;
  children: ReactNode;
}) {
  const [referenceData] = useState<User | null>(initialReferenceData);

  return (
    <ReferenceDataContext.Provider value={{ referenceData }}>
      {children}
    </ReferenceDataContext.Provider>
  );
}

export function useReferenceData() {
  const context = useContext(ReferenceDataContext);

  if (!context) {
    throw new Error(
      "useReferenceData must be used within ReferenceDataProvider",
    );
  }

  return context;
}
