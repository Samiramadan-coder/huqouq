"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function MyCasesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Client.Cases");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="container max-w-3xl space-y-4 py-10">
      <p className="text-sm text-primary/75">{t("loadError")}</p>

      <Button
        variant="outline"
        className="h-10 rounded-xs"
        onClick={() => unstable_retry()}
      >
        {t("retry")}
      </Button>
    </div>
  );
}
