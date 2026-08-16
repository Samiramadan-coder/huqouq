"use client";

import {
  LawyerProfile,
  educationSchema,
  EducationFormValues,
} from "@/types/lawyer/profile";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateEducation } from "@/lib/lawyer/dashboard";
import { listOfMonths, listOfYears } from "@/constants/shared";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";

const initialEducationEntry: EducationFormValues["entries"][number] = {
  degree: "bachelors",
  university: "",
  graduation_month: 1,
  graduation_year: new Date().getFullYear(),
  description: "",
  certificate: undefined,
};

export default function Education({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const t = useTranslations("Lawyer.Profile.Education");
  const tDashboard = useTranslations("Lawyer.Profile");

  const {
    control,
    register,
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema(t)),
    defaultValues: {
      entries: lawyerProfile.profile.educations.map((education) => ({
        degree: education.degree || "bachelors",
        university: education.university || "",
        graduation_month: education.graduation_month || 1,
        graduation_year: education.graduation_year || new Date().getFullYear(),
        description: education.description || "",
        certificate: education.certificate_url || undefined,
      })) || [initialEducationEntry],
    },
  });

  const entries = useWatch({ control, name: "entries" });

  const onSubmit: SubmitHandler<EducationFormValues> = async (data) => {
    const result = await updateEducation(data);

    if (result.success) {
      toast.success(t("Messages.EducationUpdated"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof EducationFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("Messages.EducationUpdateFailed"));
  };

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
      {entries.map((_, idx) => (
        <div
          key={idx}
          className="bg-[#FAFAF8] p-4 rounded-sm border border-secondary/20 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {idx > 0 && (
            <div className="sm:col-span-2 flex justify-end">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  const currentEntries = [...entries];
                  currentEntries.splice(idx, 1);
                  setValue("entries", currentEntries);
                }}
              >
                <Trash2 className="text-red-300" />
              </Button>
            </div>
          )}

          <FormSelect
            control={control}
            required
            name={`entries.${idx}.degree`}
            label={t("Fields.Degree.Label")}
            placeholder={t("Fields.Degree.Placeholder")}
            className="sm:col-span-2"
            triggerClassName="bg-background border border-secondary/20!"
            options={[
              {
                value: "bachelors",
                label: t("Fields.Degree.Options.Bachelors"),
              },
            ]}
          />

          <FormSelect
            control={control}
            required
            name={`entries.${idx}.graduation_month`}
            label={t("Fields.GraduationMonth.Label")}
            placeholder={t("Fields.GraduationMonth.Placeholder")}
            triggerClassName="bg-background border border-secondary/20!"
            options={listOfMonths}
          />

          <FormSelect
            control={control}
            required
            name={`entries.${idx}.graduation_year`}
            label={t("Fields.GraduationYear.Label")}
            placeholder={t("Fields.GraduationYear.Placeholder")}
            triggerClassName="bg-background border border-secondary/20!"
            options={listOfYears}
          />

          <FormInput
            required
            register={register}
            name={`entries.${idx}.university`}
            label={t("Fields.University.Label")}
            placeholder={t("Fields.University.Placeholder")}
            inputClassName="bg-background border border-secondary/20!"
            className="sm:col-span-2"
          />

          <FormTextarea
            register={register}
            name={`entries.${idx}.description`}
            label={t("Fields.Description.Label")}
            placeholder={t("Fields.Description.Placeholder")}
            className="sm:col-span-2"
            textareaClassName="bg-background border border-secondary/20!"
          />

          <SingleFormFileUploader
            control={control}
            name={`entries.${idx}.certificate`}
            className="md:col-span-2"
            label={t("Fields.CertificateUpload.Label")}
          />
        </div>
      ))}

      <div>
        <Button
          type="button"
          variant="ghost"
          className="w-auto text-secondary hover:bg-transparent"
          onClick={() => {
            setValue("entries", [...entries, initialEducationEntry]);
          }}
        >
          <Plus />
          {t("AddEducation")}
        </Button>
      </div>

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
