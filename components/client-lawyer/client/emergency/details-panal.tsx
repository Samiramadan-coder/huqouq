"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, Star } from "lucide-react";
import { Emergency } from "@/types/client/emergency";
import EmergencyCaseFormStep from "./emergency-case-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

// Seconds as "mm:ss", e.g. 702 -> "11:42"
export function toDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  return `${String(minutes).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// Seconds the client waited before a lawyer connected
function waitSeconds(emergency: Emergency) {
  const { connected_at } = emergency.call;
  if (connected_at) {
    const diff =
      (new Date(connected_at).getTime() -
        new Date(emergency.created_at).getTime()) /
      1000;
    if (!Number.isNaN(diff) && diff >= 0) return diff;
  }
  return emergency.elapsed_seconds;
}

export function DetailsPanel({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Client.EmergencyHistory");
  const format = useFormatters();

  return (
    <div className="space-y-4 whitespace-normal">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-widest text-primary/40">
          {t("whatHappened")}
        </p>
        <p className="text-sm text-primary/80 leading-relaxed wrap-break-word">
          {emergency.description || t("noDetails")}
        </p>
      </div>

      <div className="flex flex-wrap gap-10">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-primary/40">
            {t("waitTime")}
          </p>
          <p className="text-sm font-semibold text-primary">
            {format.digits(toDuration(waitSeconds(emergency)))}
          </p>
        </div>

        {emergency.rating != null && (
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-widest text-primary/40">
              {t("yourRating")}
            </p>
            <RatingStars rating={emergency.rating} />
            {emergency.rating_comment && (
              <p className="text-xs text-primary/60">
                {emergency.rating_comment}
              </p>
            )}
          </div>
        )}
      </div>

      <StartCase emergency={emergency} />
    </div>
  );
}

// "Start a case with this lawyer" while the API allows it (up to 7 days after
// the call); once that window has passed, a note says it expired
function StartCase({ emergency }: { emergency: Emergency }) {
  const t = useTranslations("Client.EmergencyHistory");
  const [open, setOpen] = useState(false);
  // Read once when the row opens; a past expiry date stays past
  const [now] = useState(() => Date.now());

  if (emergency.case_id) return null;

  if (!emergency.can.start_case) {
    const expiresAt = emergency.conversion_expires_at
      ? new Date(emergency.conversion_expires_at).getTime()
      : NaN;
    const expired = !Number.isNaN(expiresAt) && expiresAt <= now;

    return expired ? (
      <p className="flex items-center gap-1.5 text-xs text-primary/45">
        <Clock className="size-3.5" aria-hidden="true" />
        {t("startCaseExpired")}
      </p>
    ) : null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-10 rounded-sm border-accent/40 text-accent hover:bg-accent/5 hover:text-accent"
      >
        <Briefcase className="size-4" aria-hidden="true" />
        {t("startCase")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-sm ring-0! p-6">
          <DialogTitle className="sr-only">{t("startCase")}</DialogTitle>
          <DialogDescription className="sr-only">
            {emergency.legal_area.name}
          </DialogDescription>
          {open && (
            <EmergencyCaseFormStep
              emergency={emergency}
              onDone={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const format = useFormatters();

  return (
    <p
      className="flex items-center gap-0.5"
      aria-label={`${format.number(rating)}/${format.number(5)}`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          className={cn(
            "size-4 text-secondary",
            star <= rating && "fill-accent text-accent",
          )}
        />
      ))}
    </p>
  );
}
