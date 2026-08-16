"use client";

import {
  specializationsServicesSchema,
  SpecializationsServicesFormValues,
  LawyerProfile,
} from "@/types/lawyer/profile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { updateSpecializationsServices } from "@/lib/lawyer/dashboard";
import { useReferenceData } from "@/providers/reference-data.provider";

export default function SpecializationServices({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const { referenceData } = useReferenceData();
  const tDashboard = useTranslations("Lawyer.Profile");
  const t = useTranslations("Lawyer.Profile.SpecializationServices");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SpecializationsServicesFormValues>({
    resolver: zodResolver(specializationsServicesSchema(t)),
    defaultValues: {
      specialization_ids: lawyerProfile.profile.specialization_ids || [],
      service_ids: lawyerProfile.profile.service_ids || [],
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
                {referenceData?.specializations.map((specialization) => (
                  <Button
                    type="button"
                    variant="outline"
                    key={specialization.id}
                    onClick={() => {
                      if (value.includes(specialization.id)) {
                        field.onChange(
                          value.filter((id) => id !== specialization.id),
                        );
                        return;
                      }
                      field.onChange([...value, specialization.id]);
                    }}
                    className={cn(
                      "rounded-xs border-primary/10 text-primary/35 text-xs h-9 px-4 font-normal hover:bg-secondary/20 hover:text-secondary",
                      value.includes(specialization.id) &&
                        "bg-secondary/20 text-secondary",
                    )}
                  >
                    {value.includes(specialization.id) && <Check />}
                    {specialization.name}
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
                {referenceData?.services.map((service) => (
                  <Button
                    type="button"
                    variant="outline"
                    key={service.id}
                    onClick={() => {
                      if (value.includes(service.id)) {
                        field.onChange(value.filter((id) => id !== service.id));
                        return;
                      }
                      field.onChange([...value, service.id]);
                    }}
                    className={cn(
                      "rounded-xs border-primary/10 text-primary/35 text-xs h-9 px-4 font-normal hover:bg-secondary/20 hover:text-secondary",
                      value.includes(service.id) &&
                        "bg-secondary/20 text-secondary",
                    )}
                  >
                    {value.includes(service.id) && <Check />}
                    {service.name}
                  </Button>
                ))}
              </div>

              <FieldError errors={[errors.service_ids]} />
            </div>
          );
        }}
      />

      {lawyerProfile.is_editable && (
        <div className="flex justify-end">
          <SubmitBtn
            label={tDashboard("SaveSection")}
            loading={isSubmitting}
            showArrow={false}
            className="min-w-35 w-auto h-9 px-5"
          />
        </div>
      )}
    </form>
  );
}
