"use client";

import BlockCard from "./blocked-card";
import { useForm, SubmitHandler } from "react-hook-form";
import BlockedDates from "./blocked-dates";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import ConsultationSettings from "./consultation-settings";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { AvailabilitySettings } from "@/types/lawyer/consultations";
import WeeklyRecuringAvailability from "./weekly-recuring-availability";
import { availabilitySettingsSchema } from "@/types/lawyer/consultations";

export default function AvailabilitySettingsForm() {
  const t = useTranslations("Lawyer.Consultations.AvailabilitySettings");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AvailabilitySettings>({
    resolver: zodResolver(availabilitySettingsSchema(t)),
    defaultValues: {
      slot_duration: 30,
      consultation_type: [],
      price_per_consultation: undefined,
      buffer_time_between_sessions: 0,
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
        />
      </BlockCard>

      <BlockCard title={t("Sections.WeeklyRecurringAvailability")}>
        <WeeklyRecuringAvailability />
      </BlockCard>

      <BlockCard title={t("Sections.BlockedDates")}>
        <BlockedDates />
      </BlockCard>

      <SubmitBtn
        label={t("Sections.SaveAvailability")}
        className="bg-accent w-auto px-6"
        loading={isSubmitting}
      />
    </form>
  );
}
