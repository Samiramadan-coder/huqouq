"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Error boundary UI for a route segment: explains the failure and offers a retry
export default function RouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="container max-w-5xl space-y-4 py-10">
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
