"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { saveToFavourite } from "@/lib/client/find-lawyer";
import { cn } from "@/lib/utils";

export default function AddToFavorite({
  name,
  id,
  isFavourite,
  fromDetails = false,
}: {
  name: string;
  id: number;
  isFavourite: boolean;
  fromDetails?: boolean;
}) {
  const t = useTranslations("Client.FindLawyer");
  const [loading, setLoading] = useState(false);

  async function handleAddToFavorite() {
    setLoading(true);
    const result = await saveToFavourite(id, isFavourite);

    if (result.success) {
      toast.success(result.message);
      setLoading(false);
      return;
    } else {
      toast.error(t("failedToSaveToFavourites"));
      setLoading(false);
    }
  }

  if (fromDetails) {
    return (
      <button
        type="button"
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-1.5 py-2 text-xs text-slate-400 transition-colors hover:text-primary",
          isFavourite ? "text-rose-500" : "",
        )}
        onClick={handleAddToFavorite}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Heart className="size-3.5" aria-hidden="true" />
        )}
        {t("saveToFavourites")}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={`${t("saveToFavourites")}: ${name}`}
      className="absolute inset-e-3 top-3 size-9 rounded-full bg-white text-slate-400 shadow-sm hover:bg-white hover:text-rose-500"
      onClick={handleAddToFavorite}
    >
      {loading ? (
        <Spinner />
      ) : (
        <Heart
          className={`size-4 ${isFavourite ? "text-rose-500" : ""}`}
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
