import {
  Control,
  UseFormRegister,
  Controller,
  FieldErrors,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError, FieldLabel } from "@/components/ui/field";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import { AvailabilitySettings, Options } from "@/types/lawyer/consultations";

type Props = {
  register: UseFormRegister<AvailabilitySettings>;
  control: Control<AvailabilitySettings>;
  errors: FieldErrors<AvailabilitySettings>;
  options: Options;
  currency: string;
};

export default function ConsultationSettings({
  register,
  control,
  errors,
  options,
  currency,
}: Props) {
  const t = useTranslations("Lawyer.Consultations.AvailabilitySettings");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="sm:col-span-2">
        <Controller
          control={control}
          name="types"
          render={({ field }) => (
            <div className="space-y-3">
              <FieldLabel
                id="types-label"
                className="text-xs text-primary/50 uppercase tracking-widest font-semibold after:ms-1 after:text-destructive after:content-['*']"
              >
                {t("Fields.ConsultationType.Label")}
              </FieldLabel>

              <div
                role="group"
                aria-labelledby="types-label"
                className="flex items-center gap-6"
              >
                {options.types.map((type) => (
                  <div className="flex items-center gap-2" key={type.value}>
                    <Checkbox
                      id={`types_${type.value}`}
                      checked={field.value.includes(type.value)}
                      className="rounded-xs data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked
                            ? [...field.value, type.value]
                            : field.value.filter((v) => v !== type.value),
                        )
                      }
                    />
                    <label
                      htmlFor={`types_${type.value}`}
                      className="text-xs text-primary/70"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>

              <FieldError errors={[errors.types]} />
            </div>
          )}
        />
      </div>

      <FormSelect
        control={control}
        name="slot_minutes"
        label={t("Fields.SlotDuration.Label")}
        triggerClassName="border border-secondary bg-background"
        required
        options={options.slot_minutes}
      />

      <FormInput
        register={register}
        name="price"
        label={t("Fields.PricePerConsultation.Label")}
        inputClassName="border border-secondary bg-background"
        prefix={currency}
        type="number"
        required
        errors={errors}
        min={options.price.min}
        max={options.price.max}
      />

      <FormSelect
        control={control}
        name="buffer_minutes"
        label={t("Fields.BufferTimeBetweenSessions.Label")}
        placeholder={t("Fields.BufferTimeBetweenSessions.Placeholder")}
        triggerClassName="border border-secondary bg-background"
        className="sm:col-span-2"
        required
        options={options.buffer_minutes}
      />
    </div>
  );
}
