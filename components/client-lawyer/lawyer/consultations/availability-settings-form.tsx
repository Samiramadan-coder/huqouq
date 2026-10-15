"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import SectionCard from "./section-card";
import BlockedDates from "./blocked-dates";
import WeeklyAvailability, { withSlotEnds } from "./weekly-availability";
import ConsultationSettings from "./consultation-settings";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { updateAvailabilitySettings } from "@/lib/lawyer/consultations";
import {
  Data,
  Options,
  AvailabilitySettings,
  availabilitySettingsSchema,
} from "@/types/lawyer/consultations";

type Props = {
  options: Options;
  data: Data;
};

export default function AvailabilitySettingsForm({ options, data }: Props) {
  const t = useTranslations("Lawyer.Consultations.AvailabilitySettings");
  const tCommon = useTranslations("Common");

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

  const onSubmit: SubmitHandler<AvailabilitySettings> = async (values) => {
    let result: Awaited<ReturnType<typeof updateAvailabilitySettings>>;

    try {
      result = await updateAvailabilitySettings({
        ...values,
        // Re-derive slot ends in case slot_minutes changed after slots were set
        weekly: withSlotEnds(values.weekly, values.slot_minutes),
      });
    } catch {
      toast.error(tCommon("EditFailed"));
      return;
    }

    if (result.success) {
      toast.success(result.message);
      return;
    }

    Object.entries(result.errors ?? {}).forEach(([field, message]) => {
      if (!message) return;
      setError(field as keyof AvailabilitySettings, {
        type: "manual",
        message,
      });
    });

    toast.error(result.message ?? tCommon("EditFailed"));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <SectionCard title={t("Sections.ConsultationSettings")}>
        <ConsultationSettings
          register={register}
          control={control}
          errors={errors}
          options={options}
          currency={data.currency}
        />
      </SectionCard>

      <SectionCard title={t("Sections.WeeklyRecurringAvailability")}>
        <WeeklyAvailability control={control} options={options} />
      </SectionCard>

      <SectionCard title={t("Sections.BlockedDates")}>
        <BlockedDates control={control} />
      </SectionCard>

      <SubmitBtn
        label={t("Sections.SaveAvailability")}
        className="bg-accent w-auto px-6"
        loading={isSubmitting}
      />
    </form>
  );
}
