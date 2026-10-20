"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function FavoritesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Client.FindLawyer");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="space-y-4 p-4 sm:p-6">
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
