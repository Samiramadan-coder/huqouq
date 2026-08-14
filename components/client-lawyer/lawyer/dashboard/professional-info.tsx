"use client";

import {
  LawyerProfile,
  professionalInfoSchema,
  ProfessionalInfoFormValues,
} from "@/types/lawyer/dashboard";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import { useForm, SubmitHandler, useWatch, Controller } from "react-hook-form";

export default function ProfessionalInfo({
  profile,
}: {
  profile: LawyerProfile["profile"];
}) {
  const t = useTranslations("Lawyer.Dashboard");

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalInfoFormValues>({
    mode: "onSubmit",
    defaultValues: {
      account_type: profile.account_type || "freelance",
      office_name: profile.office_name || "",
      academic_degree: profile.academic_degree || undefined,
      years_of_experience: profile.years_of_experience || undefined,
      bar_number: profile.bar_number || "",
      bar_degree: profile.bar_degree || undefined,
    },
    resolver: zodResolver(professionalInfoSchema(t)),
  });

  const accountType = useWatch({ control, name: "account_type" });

  const onSubmit: SubmitHandler<ProfessionalInfoFormValues> = async (data) => {
    console.log(data);
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
          const accountTypeOptions = ["freelance", "company", "office"];
          const value = field.value || "freelance";

          return (
            <div className="space-x-2">
              {accountTypeOptions.map((type) => (
                <Button
                  type="button"
                  variant="outline"
                  key={type}
                  {...field}
                  value={type}
                  onClick={() => {
                    setValue("office_name", "");
                    field.onChange(type);
                  }}
                  className={cn(
                    "rounded-xs border-secondary/20 text-xs h-9 px-4 font-normal hover:bg-primary hover:text-primary-foreground",
                    value === type && "bg-primary text-primary-foreground",
                  )}
                >
                  {t(
                    `Fields.ProfessionalInfo.AccountType.Options.${type.charAt(0).toUpperCase() + type.slice(1)}`,
                  )}
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
          label={t("Fields.ProfessionalInfo.OfficeName.Label")}
          placeholder={t("Fields.ProfessionalInfo.OfficeName.Placeholder")}
          className="sm:col-span-2"
          inputClassName="bg-background border border-secondary/20!"
        />
      )}

      <FormInput
        type="number"
        required
        errors={errors}
        register={register}
        name="years_of_experience"
        label={t("Fields.ProfessionalInfo.YearsOfExperience.Label")}
        placeholder={t("Fields.ProfessionalInfo.YearsOfExperience.Placeholder")}
        className="sm:col-span-2"
        inputClassName="bg-background border border-secondary/20!"
      />

      <FormInput
        required
        errors={errors}
        register={register}
        name="bar_number"
        label={t("Fields.ProfessionalInfo.BarNumber.Label")}
        placeholder={t("Fields.ProfessionalInfo.BarNumber.Placeholder")}
        className="sm:col-span-2"
        inputClassName="bg-background border border-secondary/20!"
      />

      <FormSelect
        control={control}
        name="bar_degree"
        label={t("Fields.ProfessionalInfo.BarDegree.Label")}
        placeholder={t("Fields.ProfessionalInfo.BarDegree.Placeholder")}
        triggerClassName="bg-background border border-secondary/20!"
        options={[
          {
            value: "court_of_cassation",
            label: t(
              "Fields.ProfessionalInfo.BarDegree.Options.CourtOfCassation",
            ),
          },
        ]}
      />

      <FormSelect
        control={control}
        name="academic_degree"
        label={t("Fields.ProfessionalInfo.AcademicDegree.Label")}
        placeholder={t("Fields.ProfessionalInfo.AcademicDegree.Placeholder")}
        triggerClassName="bg-background border border-secondary/20!"
        options={[
          {
            value: "masters",
            label: t("Fields.ProfessionalInfo.AcademicDegree.Options.Masters"),
          },
        ]}
      />

      <p className="sm:col-span-2 text-primary/40 text-[11px] bg-background p-2">
        {t("Fields.ProfessionalInfo.LanguageHint")}
      </p>

      <div className="sm:col-span-2 flex justify-end">
        <SubmitBtn
          label="SaveSection"
          loading={isSubmitting}
          showArrow={false}
          className="w-auto h-9 px-5"
        />
      </div>
    </form>
  );
}
