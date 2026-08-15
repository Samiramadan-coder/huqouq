"use client";

import {
  specializationsServicesSchema,
  SpecializationsServicesFormValues,
  LawyerProfile,
} from "@/types/lawyer/dashboard";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FieldError } from "@/components/ui/field";
import { updateSpecializationsServices } from "@/lib/lawyer/dashboard";
import { toast } from "sonner";
import { Check } from "lucide-react";

const specializations = [
  { label: "Specialization1", value: 1 },
  { label: "Specialization2", value: 2 },
  { label: "Specialization3", value: 3 },
  { label: "Specialization4", value: 4 },
  { label: "Specialization5", value: 5 },
  { label: "Specialization6", value: 6 },
  { label: "Specialization7", value: 7 },
  { label: "Specialization8", value: 8 },
  { label: "Specialization9", value: 9 },
  { label: "Specialization10", value: 10 },
];

const services = [
  { label: "Service1", value: 1 },
  { label: "Service2", value: 2 },
  { label: "Service3", value: 3 },
  { label: "Service4", value: 4 },
  { label: "Service5", value: 5 },
  { label: "Service6", value: 6 },
  { label: "Service7", value: 7 },
  { label: "Service8", value: 8 },
  { label: "Service9", value: 9 },
  { label: "Service10", value: 10 },
];

export default function SpecializationServices({
  profile,
}: {
  profile: LawyerProfile["profile"];
}) {
  const t = useTranslations("Lawyer.Dashboard.SpecializationServices");
  const tDashboard = useTranslations("Lawyer.Dashboard");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SpecializationsServicesFormValues>({
    resolver: zodResolver(specializationsServicesSchema(t)),
    defaultValues: {
      specialization_ids: profile.specialization_ids || [],
      service_ids: profile.service_ids || [],
    },
  });

  const onSubmit: SubmitHandler<SpecializationsServicesFormValues> = async (
    data,
  ) => {
    const result = await updateSpecializationsServices(data);

    if (result.success) {
      toast.success(t("Messages.SpecializationServicesUpdated"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof SpecializationsServicesFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("Messages.SpecializationServicesUpdateFailed"));
  };

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="specialization_ids"
        render={({ field }) => {
          const value = field.value || [];

          return (
            <div className="space-y-4">
              <p className="text-xs text-primary/50 uppercase tracking-widest font-semibold after:ms-1 after:text-destructive after:content-['*']">
                {t("Fields.Specializations.Label")}
              </p>

              <div className="flex flex-wrap gap-2">
                {specializations.map((specialization) => (
                  <Button
                    type="button"
                    variant="outline"
                    key={specialization.value}
                    onClick={() => {
                      if (value.includes(specialization.value)) {
                        field.onChange(
                          value.filter((id) => id !== specialization.value),
                        );
                        return;
                      }
                      field.onChange([...value, specialization.value]);
                    }}
                    className={cn(
                      "rounded-xs border-primary/10 text-primary/35 text-xs h-9 px-4 font-normal hover:bg-secondary/20 hover:text-secondary",
                      value.includes(specialization.value) &&
                        "bg-secondary/20 text-secondary",
                    )}
                  >
                    {value.includes(specialization.value) && <Check />}
                    {specialization.label}
                  </Button>
                ))}
              </div>

              <FieldError errors={[errors.specialization_ids]} />
            </div>
          );
        }}
      />

      <Controller
        control={control}
        name="service_ids"
        render={({ field }) => {
          const value = field.value || [];

          return (
            <div className="space-y-4">
              <p className="text-xs text-primary/50 uppercase tracking-widest font-semibold">
                {t("Fields.Services.Label")}
              </p>

              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Button
                    type="button"
                    variant="outline"
                    key={service.value}
                    onClick={() => {
                      if (value.includes(service.value)) {
                        field.onChange(
                          value.filter((id) => id !== service.value),
                        );
                        return;
                      }
                      field.onChange([...value, service.value]);
                    }}
                    className={cn(
                      "rounded-xs border-primary/10 text-primary/35 text-xs h-9 px-4 font-normal hover:bg-secondary/20 hover:text-secondary",
                      value.includes(service.value) &&
                        "bg-secondary/20 text-secondary",
                    )}
                  >
                    {value.includes(service.value) && <Check />}
                    {service.label}
                  </Button>
                ))}
              </div>

              <FieldError errors={[errors.service_ids]} />
            </div>
          );
        }}
      />

      <div className="flex justify-end">
        <SubmitBtn
          label={tDashboard("SaveSection")}
          loading={isSubmitting}
          showArrow={false}
          className="min-w-35 w-auto h-9 px-5"
        />
      </div>
    </form>
  );
}
