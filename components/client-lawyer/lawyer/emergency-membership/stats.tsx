import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { EmergencyMemberShip } from "@/types/lawyer/emergency-membership";

export default function Stats({
  stats,
}: {
  stats: EmergencyMemberShip["stats"];
}) {
  const t = useTranslations("Lawyer.EmergencyMembership.Stats");
  const format = useFormatters();

  // e.g. 11 -> "11s", 75 -> "1m 15s"; "—" when there is no data yet
  const responseTime = (seconds: number | null) => {
    if (seconds == null) return "—";

    const total = Math.round(seconds);
    const minutes = Math.floor(total / 60);
    const rest = total % 60;

    if (minutes === 0) return t("seconds", { value: format.number(rest) });
    if (rest === 0) return t("minutes", { value: format.number(minutes) });
    return t("minutesSeconds", {
      minutes: format.number(minutes),
      seconds: format.number(rest),
    });
  };

  const items = [
    { key: "received", value: format.number(stats.received) },
    { key: "accepted", value: format.number(stats.accepted) },
    { key: "missed", value: format.number(stats.missed) },
    { key: "avgResponse", value: responseTime(stats.avg_response_seconds) },
    { key: "converted", value: format.number(stats.converted) },
  ] as const;

  return (
    <section aria-labelledby="emergency-stats-title" className="space-y-3">
      <h2
        id="emergency-stats-title"
        className="ltr:font-lora text-lg font-semibold text-primary"
      >
        {t("title")}
      </h2>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col-reverse gap-1 rounded-sm border border-secondary bg-white p-4"
          >
            <dt className="text-xs text-primary/45">{t(item.key)}</dt>
            <dd className="ltr:font-lora text-2xl font-bold text-primary">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
