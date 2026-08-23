"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function Title({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <h1 className={cn("text-2xl font-semibold", fontClass)}>{children}</h1>
  );
}
