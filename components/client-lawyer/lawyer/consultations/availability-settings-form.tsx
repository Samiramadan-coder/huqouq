"use client";

import BlockCard from "./blocked-card";
import BlockedDates from "./blocked-dates";
import { useTranslations } from "next-intl";
import {
  Data,
  Options,
  AvailabilitySettings,
  availabilitySettingsSchema,
} from "@/types/lawyer/consultations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import ConsultationSettings from "./consultation-settings";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import WeeklyRecuringAvailability from "./weekly-recuring-availability";
import { updateAvailabilitySettings } from "@/lib/lawyer/consultations";
import { toast } from "sonner";

export default function AvailabilitySettingsForm({
  options,
  data,
}: {
  options: Options;
  data: Data;
}) {
  const t = useTranslations("Lawyer.Consultations.AvailabilitySettings");

  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AvailabilitySettings>({
    resolver: zodResolver(availabilitySettingsSchema(t)),
    defaultValues: {
      slot_minutes: data.slot_minutes ?? options.slot_minutes[0].value,
      types: data.types ?? [],
      price: data.price ?? undefined,
      buffer_minutes: data.buffer_minutes ?? 0,
      blocked_dates: data.blocked_dates ?? [],
      weekly: data.weekly ?? {
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
      },
    },
  });

  const onSubmit: SubmitHandler<AvailabilitySettings> = async (data) => {
    const result = await updateAvailabilitySettings(data);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    const fieldErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    if (fieldErrors.length > 0) {
      fieldErrors.forEach(([field, message]) => {
        setError(field as keyof AvailabilitySettings, {
          type: "manual",
          message,
        });
      });

      return;
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <BlockCard title={t("Sections.ConsultationSettings")}>
        <ConsultationSettings
          register={register}
          control={control}
          errors={errors}
          options={options}
        />
      </BlockCard>

      <BlockCard title={t("Sections.WeeklyRecurringAvailability")}>
        <WeeklyRecuringAvailability control={control} options={options} />
      </BlockCard>

      <BlockCard title={t("Sections.BlockedDates")}>
        <BlockedDates control={control} />
      </BlockCard>

      <SubmitBtn
        label={t("Sections.SaveAvailability")}
        className="bg-accent w-auto px-6"
        loading={isSubmitting}
      />
    </form>
  );
}
