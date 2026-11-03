"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PublicSettings } from "@/types/public-settings";

const PublicSettingsContext = createContext<PublicSettings | null>(null);

export function PublicSettingsProvider({
  settings,
  children,
}: {
  settings: PublicSettings;
  children: ReactNode;
}) {
  return (
    <PublicSettingsContext.Provider value={settings}>
      {children}
    </PublicSettingsContext.Provider>
  );
}

export function usePublicSettings() {
  const context = useContext(PublicSettingsContext);

  if (!context) {
    throw new Error(
      "usePublicSettings must be used within PublicSettingsProvider",
    );
  }

  return context;
}
