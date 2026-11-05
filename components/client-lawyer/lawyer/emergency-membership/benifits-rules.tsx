import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const BENEFITS = ["urgentClients", "noCommission", "convertCalls"] as const;
const RULES = [
  "respondWithin",
  "missedLowerPriority",
  "identityHidden",
  "noCommission",
  "normalCaseFees",
] as const;

export default function BenifitsRules() {
  const t = useTranslations("Lawyer.EmergencyMembership");

  return (
    <div className="grid gap-4 pt-4 md:grid-cols-2">
      <div className="bg-white border border-secondary rounded-sm p-6">
        <h2 className="ltr:font-lora mb-4 font-semibold text-primary">
          {t("benefitsTitle")}
        </h2>
        <ul className="space-y-3">
          {BENEFITS.map((key) => (
            <li
              key={key}
              className="flex items-center gap-3 text-sm text-primary/70"
            >
              <CircleCheck
                className="size-4 shrink-0 text-green-700"
                aria-hidden="true"
              />
              {t(`benefits.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-secondary rounded-sm p-6">
        <h2 className="ltr:font-lora mb-4 font-semibold text-primary">
          {t("rulesTitle")}
        </h2>
        <ul className="space-y-3">
          {RULES.map((key) => (
            <li
              key={key}
              className="flex items-center gap-3 text-sm text-primary/70"
            >
              <span
                className="size-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden="true"
              />
              {t(`rules.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
