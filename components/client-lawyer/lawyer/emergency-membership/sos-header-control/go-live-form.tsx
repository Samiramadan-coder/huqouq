import {
  EmergencyLive,
  goLiveSchema,
  GoLiveFormValues,
} from "@/types/lawyer/emergency-membership";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { DialogClose } from "@/components/ui/dialog";
import { DialogIconHeader } from "./dialog-icon-header";
import { updateAvailability } from "@/lib/lawyer/emergency-membership";
import { useReferenceData } from "@/providers/reference-data.provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Radio value for "until I turn it off" (auto_off: null)
const UNTIL_OFF = "until_off";

const sectionLabelClassName =
  "text-xs font-semibold uppercase tracking-widest text-primary/45";

export function GoLiveForm({
  emergencyLive,
  onDone,
}: {
  emergencyLive: EmergencyLive;
  onDone: () => void;
}) {
  const format = useFormatters();
  const { referenceData } = useReferenceData();
  const t = useTranslations("Lawyer.EmergencyLive");
  const specializations = referenceData?.specializations ?? [];

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<GoLiveFormValues>({
    resolver: zodResolver(goLiveSchema(t)),
    mode: "onChange",
    defaultValues: {
      auto_off: null,
      areas: emergencyLive.areas,
    },
  });

  // e.g. 30 -> "30 minutes", 60 -> "1 hour", 120 -> "2 hours"
  const durationLabel = (minutes: number) =>
    minutes % 60 === 0
      ? t("hours", { count: minutes / 60, value: format.number(minutes / 60) })
      : t("minutes", { count: minutes, value: format.number(minutes) });

  const autoOffOptions = [
    ...emergencyLive.auto_off_options.map((minutes) => ({
      value: String(minutes),
      label: durationLabel(minutes),
    })),
    {
      value: UNTIL_OFF,
      label: t("GoLive.untilOff"),
    },
  ];

  async function onSubmit(values: GoLiveFormValues) {
    const result = await updateAvailability({
      is_live: true,
      office_emirate: emergencyLive.office_emirate,
      ...values,
    });

    if (result.success) {
      toast.success(result.message ?? t("liveSuccess"));
      onDone();
      return;
    }

    toast.error(result.message ?? t("failed"));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <DialogIconHeader
        icon={<Zap className="size-5" aria-hidden="true" />}
        iconClassName="bg-destructive/10 text-destructive"
        title={t("GoLive.title")}
      />

      <Controller
        control={control}
        name="auto_off"
        render={({ field }) => {
          const value = field.value == null ? UNTIL_OFF : String(field.value);

          return (
            <div className="space-y-2">
              <p id="auto-off-label" className={sectionLabelClassName}>
                {t("GoLive.autoOff")}
              </p>

              <RadioGroup
                value={value}
                onValueChange={(next) =>
                  field.onChange(next === UNTIL_OFF ? null : Number(next))
                }
                aria-labelledby="auto-off-label"
                className="grid-cols-2"
              >
                {autoOffOptions.map((option) => {
                  const id = `auto-off-${option.value}`;

                  return (
                    <label
                      key={option.value}
                      htmlFor={id}
                      className={cn(
                        "flex h-11 cursor-pointer items-center gap-3 rounded-sm border px-3 text-sm text-primary transition-colors",
                        value === option.value
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
          );
        }}
      />

      <Controller
        control={control}
        name="areas"
        render={({ field, fieldState }) => {
          const toggle = (id: number) =>
            field.onChange(
              field.value.includes(id)
                ? field.value.filter((areaId) => areaId !== id)
                : [...field.value, id],
            );

          return (
            <div className="space-y-2">
              <p id="areas-label" className={sectionLabelClassName}>
                {t("GoLive.specializations")}
              </p>

              <div
                role="group"
                aria-labelledby="areas-label"
                className="flex flex-wrap gap-2"
              >
                {specializations.map((specialization) => {
                  const selected = field.value.includes(specialization.id);

                  return (
                    <button
                      key={specialization.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggle(specialization.id)}
                      onBlur={field.onBlur}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs transition-colors",
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-secondary text-primary/60 hover:bg-secondary/20",
                      )}
                    >
                      {specialization.name}
                    </button>
                  );
                })}
              </div>

              {fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                field.value.length === 0 && (
                  <p className="text-[11px] text-primary/40">
                    {t("GoLive.selectAtLeastOne")}
                  </p>
                )
              )}
            </div>
          );
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="h-11 rounded-sm border-secondary font-normal text-primary/60"
          >
            {t("notNow")}
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="h-11 rounded-sm"
        >
          {isSubmitting && <Spinner />}
          {t("GoLive.submit")}
        </Button>
      </div>
    </form>
  );
}
