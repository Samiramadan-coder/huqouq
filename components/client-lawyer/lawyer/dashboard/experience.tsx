"use client";

import {
  LawyerProfile,
  experiencesSchema,
  ExperiencesFormValues,
} from "@/types/lawyer/dashboard";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateExperiences } from "@/lib/lawyer/dashboard";
import { listOfMonths, listOfYears } from "@/constants/shared";
import FormSwitch from "@/components/public/shared/form/switch";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";

const initialExperienceEntry: ExperiencesFormValues["entries"][number] = {
  title: "",
  organization: "",
  start_month: 1,
  start_year: new Date().getFullYear(),
  end_month: undefined,
  end_year: undefined,
  is_current: true,
  description: "",
  certificate: undefined,
};

export default function Experience({
  profile,
}: {
  profile: LawyerProfile["profile"];
}) {
  const t = useTranslations("Lawyer.Dashboard.Experience");
  const tDashboard = useTranslations("Lawyer.Dashboard");

  // Initialize the form with react-hook-form
  const {
    control,
    register,
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ExperiencesFormValues>({
    resolver: zodResolver(experiencesSchema(t)),
    defaultValues: {
      entries: profile?.experiences.map((experience) => ({
        title: experience.title || "",
        organization: experience.organization || "",
        start_month: experience.start_month || 1,
        start_year: experience.start_year || new Date().getFullYear(),
        end_month: experience.end_month || undefined,
        end_year: experience.end_year || undefined,
        is_current: experience.is_current || false,
        description: experience.description || "",
        certificate: experience.certificate_url || undefined,
      })) || [initialExperienceEntry],
    },
  });

  // Watch the entries array to dynamically render the form fields for each experience entry
  const entries = useWatch({ control, name: "entries" });

  // Handle form submission
  const onSubmit: SubmitHandler<ExperiencesFormValues> = async (data) => {
    const result = await updateExperiences(data);

    if (result.success) {
      toast.success(t("Messages.ExperienceUpdated"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof ExperiencesFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }

    toast.error(t("Messages.ExperienceUpdateFailed"));
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

          <FormInput
            required
            register={register}
            name={`entries.${idx}.title`}
            label={t("Fields.Title.Label")}
            placeholder={t("Fields.Title.Placeholder")}
            inputClassName="bg-background border border-secondary/20!"
          />

          <FormInput
            required
            register={register}
            name={`entries.${idx}.organization`}
            label={t("Fields.Organization.Label")}
            placeholder={t("Fields.Organization.Placeholder")}
            inputClassName="bg-background border border-secondary/20!"
          />

          <FormSelect
            control={control}
            required
            name={`entries.${idx}.start_month`}
            label={t("Fields.StartMonth.Label")}
            placeholder={t("Fields.StartMonth.Placeholder")}
            triggerClassName="bg-background border border-secondary/20!"
            options={listOfMonths}
          />

          <FormSelect
            control={control}
            required
            name={`entries.${idx}.start_year`}
            label={t("Fields.StartYear.Label")}
            placeholder={t("Fields.StartYear.Placeholder")}
            triggerClassName="bg-background border border-secondary/20!"
            options={listOfYears}
          />

          <div className="sm:col-span-2">
            <FormSwitch
              name={`entries.${idx}.is_current`}
              label={t("Fields.IsCurrent.Label")}
              control={control}
              onHandleChange={() => {
                setValue(`entries.${idx}.end_month`, undefined);
                setValue(`entries.${idx}.end_year`, undefined);
              }}
            />
          </div>

          {!entries[idx].is_current && (
            <>
              <FormSelect
                control={control}
                required
                name={`entries.${idx}.end_month`}
                label={t("Fields.EndMonth.Label")}
                placeholder={t("Fields.EndMonth.Placeholder")}
                triggerClassName="bg-background border border-secondary/20!"
                options={listOfMonths}
              />

              <FormSelect
                control={control}
                required
                name={`entries.${idx}.end_year`}
                label={t("Fields.EndYear.Label")}
                placeholder={t("Fields.EndYear.Placeholder")}
                triggerClassName="bg-background border border-secondary/20!"
                options={listOfYears}
              />
            </>
          )}

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
            setValue("entries", [...entries, initialExperienceEntry]);
          }}
        >
          <Plus />
          {t("AddExperience")}
        </Button>
      </div>

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
