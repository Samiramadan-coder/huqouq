"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function BrowseCasesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Lawyer.BrowseCases");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="space-y-4 px-4 sm:px-6 py-10">
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
