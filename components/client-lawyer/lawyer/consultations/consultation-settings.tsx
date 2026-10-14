import {
  Control,
  UseFormRegister,
  Controller,
  FieldErrors,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { AvailabilitySettings } from "@/types/lawyer/consultations";
import FormSelect from "@/components/public/shared/form/form-select";
import FormInput from "@/components/public/shared/form/form-input";

type Props = {
  register: UseFormRegister<AvailabilitySettings>;
  control: Control<AvailabilitySettings>;
  errors: FieldErrors<AvailabilitySettings>;
};

export default function ConsultationSettings({
  register,
  control,
  errors,
}: Props) {
  const t = useTranslations("Lawyer.Consultations.AvailabilitySettings");
  const tCommon = useTranslations("Common");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <Controller
          control={control}
          name="consultation_type"
          render={({ field }) => (
            <div className="space-y-3">
              <FieldLabel
                htmlFor="consultation_type"
                className="text-xs text-primary/50 uppercase tracking-widest font-semibold after:ms-1 after:text-destructive after:content-['*']"
              >
                {t("Fields.ConsultationType.Label")}
              </FieldLabel>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Checkbox
                    id="consultation_type_video"
                    checked={field.value.includes("video")}
                    className="rounded-xs"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...field.value, "video"]);
                      } else {
                        field.onChange(
                          field.value.filter((v) => v !== "video"),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor="consultation_type_video"
                    className="text-xs text-primary/70"
                  >
                    {t("Fields.ConsultationType.Options.VideoCall")}
                  </label>
                </div>

                <div className="flex items-center gap-1">
                  <Checkbox
                    id="consultation_type_voice"
                    checked={field.value.includes("voice")}
                    className="rounded-xs"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...field.value, "voice"]);
                      } else {
                        field.onChange(
                          field.value.filter((v) => v !== "voice"),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor="consultation_type_voice"
                    className="text-xs text-primary/70"
                  >
                    {t("Fields.ConsultationType.Options.VoiceCall")}
                  </label>
                </div>
              </div>

              <FieldError errors={[errors.consultation_type]} />
            </div>
          )}
        />
      </div>

      <FormSelect
        control={control}
        name="slot_duration"
        label={t("Fields.SlotDuration.Label")}
        triggerClassName="border border-secondary"
        required
        options={[
          { label: "30 minutes", value: 30 },
          { label: "60 minutes", value: 60 },
        ]}
      />

      <FormInput
        register={register}
        name="price_per_consultation"
        label={t("Fields.PricePerConsultation.Label")}
        inputClassName="border border-secondary"
        prefix={tCommon("AED")}
        type="number"
        required
        errors={errors}
      />

      <FormSelect
        control={control}
        name="buffer_time_between_sessions"
        label={t("Fields.BufferTimeBetweenSessions.Label")}
        placeholder={t("Fields.BufferTimeBetweenSessions.Placeholder")}
        triggerClassName="border border-secondary"
        required
        options={[
          {
            label: t("Fields.BufferTimeBetweenSessions.NoBuffer"),
            value: 0,
          },
          { label: t("Fields.Minutes", { count: 10 }), value: 10 },
          { label: t("Fields.Minutes", { count: 15 }), value: 15 },
          { label: t("Fields.Minutes", { count: 20 }), value: 30 },
        ]}
      />
    </div>
  );
}
