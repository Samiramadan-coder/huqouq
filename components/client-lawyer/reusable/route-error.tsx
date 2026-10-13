"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Error boundary UI for a route segment: explains the failure and offers a retry.
// Spacing comes from the segment's layout; pass `className` where there is none.
export default function RouteError({
  error,
  unstable_retry,
  className,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
  className?: string;
}) {
  const t = useTranslations("Common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className={cn("space-y-4", className)}>
      <p className="text-sm text-primary/75">{t("LoadError")}</p>

      <Button
        variant="outline"
        className="h-10 rounded-xs"
        onClick={() => unstable_retry()}
      >
        {t("Retry")}
      </Button>
    </div>
  );
}
