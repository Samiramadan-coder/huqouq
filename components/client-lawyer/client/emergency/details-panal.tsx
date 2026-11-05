import { useFormatters } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Emergency } from "@/types/client/emergency";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

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
    </div>
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
