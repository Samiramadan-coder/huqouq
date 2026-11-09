"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  emergencyRequestSchema,
  EmergencyRequestForm,
  Emergency,
  EMERGENCY_DESCRIPTION_MAX,
} from "@/types/client/emergency";

import { toast } from "sonner";
import { useState } from "react";
import { distanceKm } from "./utils";
import CallDialoge from "./call-dialoge";
import { DailyLimitReached } from "./emergency-states";
import { toSnakeCase } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { EMIRATE_CENTERS } from "@/constants/emergency";
import { requestEmergencyHelp } from "@/lib/client/emergency";
import { AlertCircle, MapPin, TriangleAlert } from "lucide-react";
import FormSelect from "@/components/public/shared/form/form-select";
import { useReferenceData } from "@/providers/reference-data.provider";
import FormTextarea from "@/components/public/shared/form/form-textarea";

// Beyond this distance (km) from every emirate center we treat it as outside the UAE
const MAX_DISTANCE_KM = 250;

const selectTriggerClassName =
  "h-12! min-h-12 rounded-sm border! border-secondary! px-4 aria-invalid:border-destructive!";

export default function RequestEmergencyHelp({
  triggerLabel,
}: {
  // Text on the trigger button (defaults to "Emergency Help")
  triggerLabel?: string;
} = {}) {
  const t = useTranslations("Client.Emergency");
  const { referenceData } = useReferenceData();
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  // Set when the API refuses the request because of the daily limit
  const [dailyLimit, setDailyLimit] = useState<{ message?: string } | null>(
    null,
  );

  const legalAreas = referenceData?.specializations ?? [];
  const emirates = (referenceData?.cities ?? []).map(
    ({ emirate, emirate_label }) => ({
      value: toSnakeCase(emirate),
      label: emirate_label,
    }),
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EmergencyRequestForm>({
    resolver: zodResolver(emergencyRequestSchema(t)),
    mode: "onChange",
    defaultValues: {
      legal_area_id: undefined,
      emirate: "",
      description: "",
      accept_short_call: false,
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      setLocationError(false);
      setDailyLimit(null);
    }
  }

  const descriptionLength =
    useWatch({ control, name: "description" })?.length ?? 0;

  function detectLocation() {
    setLocationError(false);

    if (!("geolocation" in navigator)) {
      setLocationError(true);
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: [number, number] = [coords.latitude, coords.longitude];

        const nearest = emirates
          .filter(({ value }) => EMIRATE_CENTERS[value])
          .map(({ value }) => ({
            value,
            distance: distanceKm(position, EMIRATE_CENTERS[value]),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        if (nearest && nearest.distance <= MAX_DISTANCE_KM) {
          setValue("emirate", nearest.value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          setLocationError(true);
        }

        setLocating(false);
      },
      () => {
        setLocationError(true);
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  async function onSubmit(values: EmergencyRequestForm) {
    const result = await requestEmergencyHelp(values);

    // The API may also accept the request but block it with this status
    if (result.success && result.emergency.status === "blocked_daily_limit") {
      setDailyLimit({ message: result.emergency.status_label });
      return;
    }

    if (result.success) {
      setEmergency(result.emergency);
      toast.success(result.message ?? t("success"));
      handleOpenChange(false);
      return;
    }

    if (result.code === "daily_limit_reached") {
      setDailyLimit({ message: result.message });
      return;
    }

    if (result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as keyof EmergencyRequestForm, { message });
      }
    }

    toast.error(result.message ?? t("failed"));
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-sm border-destructive/30 bg-transparent text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <AlertCircle className="size-4" aria-hidden="true" />
            <span className="text-xs font-normal">
              {triggerLabel ?? t("trigger")}
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg ring-0! rounded-sm border-t-4 border-t-destructive max-h-[90vh] grid-cols-[minmax(0,1fr)] overflow-x-hidden overflow-y-auto p-7">
          <DialogHeader className="flex-row items-start gap-3 border-b border-border pb-5 text-start">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </div>
          </DialogHeader>

          {dailyLimit ? (
            <DailyLimitReached
              message={dailyLimit.message}
              onClose={() => handleOpenChange(false)}
            />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="min-w-0 space-y-5"
            >
              <FormSelect
                control={control}
                name="legal_area_id"
                label={t("legalAreaLabel")}
                placeholder={t("legalAreaPlaceholder")}
                required
                triggerClassName={selectTriggerClassName}
                options={legalAreas.map((area) => ({
                  value: area.id,
                  label: area.name,
                }))}
              />

              <div className="space-y-2">
                <FormSelect
                  control={control}
                  name="emirate"
                  label={t("emirateLabel")}
                  placeholder={t("emiratePlaceholder")}
                  required
                  triggerClassName={selectTriggerClassName}
                  options={emirates}
                />

                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary disabled:opacity-60"
                >
                  {locating ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <MapPin className="size-3.5" aria-hidden="true" />
                  )}
                  {t("useLocation")}
                </button>

                <FieldError
                  errors={
                    locationError ? [{ message: t("locationError") }] : []
                  }
                />
              </div>

              <FormTextarea
                register={register}
                errors={errors}
                name="description"
                label={`${t("descriptionLabel")} (${t("optional")})`}
                placeholder={t("descriptionPlaceholder")}
                textareaClassName="border border-secondary"
                maxLength={EMERGENCY_DESCRIPTION_MAX}
                description={
                  <span className="block text-end" aria-live="polite">
                    {descriptionLength}/{EMERGENCY_DESCRIPTION_MAX}
                  </span>
                }
              />

              <Controller
                control={control}
                name="accept_short_call"
                render={({ field, fieldState }) => (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="accept_short_call"
                        aria-invalid={fieldState.invalid}
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="size-4 rounded-[3px] border-border data-[state=checked]:border-destructive data-[state=checked]:bg-destructive"
                      />
                      <Label
                        htmlFor="accept_short_call"
                        className="cursor-pointer text-sm font-normal text-muted-foreground"
                      >
                        {t("acceptShortCall")}
                      </Label>
                    </div>

                    <FieldError errors={[fieldState.error]} />
                  </div>
                )}
              />

              <Button
                className="w-full bg-destructive text-white rounded-sm h-12 hover:bg-destructive/90"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <TriangleAlert className="size-4" aria-hidden="true" />
                )}
                {t("submit")}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {t("freeNote")}
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {emergency && (
        <CallDialoge
          key={emergency?.id}
          initialEmergency={emergency}
          onClose={() => setEmergency(null)}
        />
      )}
    </>
  );
}
