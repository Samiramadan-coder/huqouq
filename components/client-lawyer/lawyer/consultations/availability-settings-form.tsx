"use client";

import BlockCard from "./blocked-card";
import BlockedDates from "./blocked-dates";
import { useTranslations } from "next-intl";
import { Data, Options } from "@/types/lawyer/consultations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import ConsultationSettings from "./consultation-settings";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { AvailabilitySettings } from "@/types/lawyer/consultations";
import WeeklyRecuringAvailability from "./weekly-recuring-availability";
import { availabilitySettingsSchema } from "@/types/lawyer/consultations";

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
      // weekly_recurring_availability: [
      //   { day: "monday", is_available: false, slots: [] },
      //   { day: "tuesday", is_available: false, slots: [] },
      //   { day: "wednesday", is_available: false, slots: [] },
      //   { day: "thursday", is_available: false, slots: [] },
      //   { day: "friday", is_available: false, slots: [] },
      //   { day: "saturday", is_available: false, slots: [] },
      //   { day: "sunday", is_available: false, slots: [] },
      // ],
    },
  });

  const onSubmit: SubmitHandler<AvailabilitySettings> = (data) => {
    console.log(data);
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
