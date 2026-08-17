"use client";

import {
  LawyerProfile,
  professionalInfoSchema,
  ProfessionalInfoFormValues,
} from "@/types/lawyer/profile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfessionalInfo } from "@/lib/lawyer/dashboard";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import { useForm, SubmitHandler, useWatch, Controller } from "react-hook-form";
import { useReferenceData } from "@/providers/reference-data.provider";

export default function ProfessionalInfo({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const { referenceData } = useReferenceData();
  const tDashboard = useTranslations("Lawyer.Profile");
  const t = useTranslations("Lawyer.Profile.ProfessionalInfo");

  const {
    control,
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalInfoFormValues>({
    mode: "onSubmit",
    defaultValues: {
      account_type: lawyerProfile.profile.account_type || "freelance",
      office_name: lawyerProfile.profile.office_name || "",
      academic_degree: lawyerProfile.profile.academic_degree || undefined,
      years_of_experience:
        lawyerProfile.profile.years_of_experience || undefined,
      bar_number: lawyerProfile.profile.bar_number || "",
      bar_degree: lawyerProfile.profile.bar_degree || undefined,
    },
    resolver: zodResolver(professionalInfoSchema(t)),
  });

  const accountType = useWatch({ control, name: "account_type" });

  const onSubmit: SubmitHandler<ProfessionalInfoFormValues> = async (data) => {
    const result = await updateProfessionalInfo(data);

    if (result.success) {
      toast.success(t("Messages.ProfessionalInfoUpdated"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof ProfessionalInfoFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("Messages.ProfessionalInfoUpdateFailed"));
  };
  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="account_type"
        render={({ field }) => {
          const value = field.value || "freelance";

          return (
            <div className="space-x-2">
              {referenceData?.account_types.map((type) => (
                <Button
                  type="button"
                  variant="outline"
                  key={type.value}
                  onClick={() => {
                    setValue("office_name", "");
                    field.onChange(type.value);
                  }}
                  className={cn(
                    "rounded-xs border-primary/10 text-xs h-9 px-4 font-normal bg-white text-primary/50 hover:bg-primary hover:text-primary-foreground",
                    value === type.value &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          );
        }}
      />

      {accountType !== "freelance" && (
        <FormInput
          required
          errors={errors}
          register={register}
          name="office_name"
          label={t("Fields.OfficeName.Label")}
          placeholder={t("Fields.OfficeName.Placeholder")}
          className="sm:col-span-2"
          inputClassName="bg-background border border-accent/20!"
        />
      )}

      <FormInput
        type="number"
        required
        errors={errors}
        register={register}
        name="years_of_experience"
        label={t("Fields.YearsOfExperience.Label")}
        placeholder={t("Fields.YearsOfExperience.Placeholder")}
        className="sm:col-span-2"
        inputClassName="bg-background border border-accent/20!"
      />

      <FormInput
        required
        errors={errors}
        register={register}
        name="bar_number"
        label={t("Fields.BarNumber.Label")}
        placeholder={t("Fields.BarNumber.Placeholder")}
        className="sm:col-span-2"
        inputClassName="bg-background border border-accent/20!"
      />

      <FormSelect
        control={control}
        required
        name="bar_degree"
        label={t("Fields.BarDegree.Label")}
        placeholder={t("Fields.BarDegree.Placeholder")}
        triggerClassName="bg-background border border-accent/20!"
        options={referenceData?.bar_degrees || []}
      />

      <FormSelect
        control={control}
        required
        name="academic_degree"
        label={t("Fields.AcademicDegree.Label")}
        placeholder={t("Fields.AcademicDegree.Placeholder")}
        triggerClassName="bg-background border border-accent/20!"
        options={referenceData?.academic_degrees || []}
      />

      <p className="sm:col-span-2 text-primary/40 text-[11px] bg-background p-2">
        {t("LanguageHint")}
      </p>

      {lawyerProfile.is_editable && (
        <div className="sm:col-span-2 flex justify-end">
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
