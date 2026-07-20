"use client";

import { cn } from "@/lib/utils";
import { useIsScroll } from "@/hook/use-is-scroll";

export default function HeaderContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrolled = useIsScroll(10);

  return (
    <header
      className={cn(
        "bg-primary text-white sticky top-0 z-50",
        scrolled && "shadow-lg shadow-black/10",
      )}
    >
      {children}
    </header>
  );
}
