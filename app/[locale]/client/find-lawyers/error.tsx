"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function FindLawyersError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Client.FindLawyer");
  const pathname = usePathname();
  const hasFilters = useSearchParams().size > 0;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="space-y-4 px-4 sm:px-6 py-10">
      <p className="text-sm text-primary/75">{t("loadError")}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="h-10 rounded-xs"
          onClick={() => unstable_retry()}
        >
          {t("retry")}
        </Button>

        {/* A bad filter value in the URL keeps failing, so offer a clean start.
            A full reload is needed because the boundary only resets on a new path. */}
        {hasFilters && (
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-xs text-accent"
          >
            <a href={pathname}>{t("clearAll")}</a>
          </Button>
        )}
      </div>
    </div>
  );
}
