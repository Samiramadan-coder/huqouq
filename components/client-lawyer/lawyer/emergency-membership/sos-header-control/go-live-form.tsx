import { useFormatters } from "@/lib/format";
import { updateAvailability } from "@/lib/lawyer/emergency-membership";
import { EmergencyLive } from "@/types/lawyer/emergency-membership";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { DialogIconHeader } from "./dialog-icon-header";
import { Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// Static until the API exposes the lawyer's emergency areas
const EMERGENCY_AREAS = [3];

// Radio value for "until I turn it off" (sent as auto_off: null)
const UNTIL_OFF = "until_off";

export function GoLiveForm({
  emergencyLive,
  onDone,
}: {
  emergencyLive: EmergencyLive;
  onDone: () => void;
}) {
  const t = useTranslations("Lawyer.EmergencyLive");
  const format = useFormatters();
  const [autoOff, setAutoOff] = useState<string>(UNTIL_OFF);
  const [pending, startTransition] = useTransition();

  // e.g. 30 -> "30 minutes", 60 -> "1 hour", 120 -> "2 hours"
  const durationLabel = (minutes: number) =>
    minutes % 60 === 0
      ? t("hours", { count: minutes / 60, value: format.number(minutes / 60) })
      : t("minutes", { count: minutes, value: format.number(minutes) });

  const options = [
    ...emergencyLive.auto_off_options.map((minutes) => ({
      value: String(minutes),
      label: durationLabel(minutes),
    })),
    { value: UNTIL_OFF, label: t("GoLive.untilOff") },
  ];

  function onGoLive() {
    startTransition(async () => {
      const result = await updateAvailability({
        is_live: true,
        auto_off: autoOff === UNTIL_OFF ? null : Number(autoOff),
        areas: EMERGENCY_AREAS,
        office_emirate: emergencyLive.office_emirate,
      });

      if (result.success) {
        toast.success(result.message ?? t("liveSuccess"));
        onDone();
        return;
      }

      toast.error(result.message ?? t("failed"));
    });
  }

  return (
    <>
      <DialogIconHeader
        icon={<Zap className="size-5" aria-hidden="true" />}
        iconClassName="bg-destructive/10 text-destructive"
        title={t("GoLive.title")}
      />

      <div className="space-y-2">
        <p
          id="auto-off-label"
          className="text-xs font-semibold uppercase tracking-widest text-primary/45"
        >
          {t("GoLive.autoOff")}
        </p>

        <RadioGroup
          value={autoOff}
          onValueChange={setAutoOff}
          aria-labelledby="auto-off-label"
          className="grid-cols-2"
        >
          {options.map((option) => {
            const id = `auto-off-${option.value}`;
            const selected = autoOff === option.value;

            return (
              <label
                key={option.value}
                htmlFor={id}
                className={cn(
                  "flex h-11 cursor-pointer items-center gap-3 rounded-sm border px-3 text-sm text-primary transition-colors",
                  selected
                    ? "border-primary bg-secondary/30"
                    : "border-secondary hover:bg-secondary/20",
                )}
              >
                <RadioGroupItem id={id} value={option.value} />
                {option.label}
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="h-11 rounded-sm border-secondary font-normal text-primary/60"
          >
            {t("notNow")}
          </Button>
        </DialogClose>
        <Button
          type="button"
          onClick={onGoLive}
          disabled={pending}
          className="h-11 rounded-sm"
        >
          {pending && <Spinner />}
          {t("GoLive.submit")}
        </Button>
      </div>
    </>
  );
}
