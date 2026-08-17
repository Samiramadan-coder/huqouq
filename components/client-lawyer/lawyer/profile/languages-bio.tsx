"use client";

import {
  LanguagesBioFormValues,
  languagesBioSchema,
  LawyerProfile,
} from "@/types/lawyer/profile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateLanguagesBio } from "@/lib/lawyer/dashboard";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useReferenceData } from "@/providers/reference-data.provider";
import FormTextarea from "@/components/public/shared/form/form-textarea";

export default function LanguagesBio({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const { referenceData } = useReferenceData();
  const t = useTranslations("Lawyer.Profile.LanguagesBio");
  const tDashboard = useTranslations("Lawyer.Profile");

  const {
    handleSubmit,
    control,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LanguagesBioFormValues>({
    resolver: zodResolver(languagesBioSchema(t)),
    defaultValues: {
      languages: lawyerProfile.profile.languages || [],
      bio: lawyerProfile.profile.bio || "",
      website_url: lawyerProfile.profile.website_url || "",
    },
  });

  const onSubmit: SubmitHandler<LanguagesBioFormValues> = async (data) => {
    const result = await updateLanguagesBio(data);

    if (result.success) {
      toast.success(t("Messages.LanguagesUpdated"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof LanguagesBioFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("Messages.LanguagesUpdateFailed"));
  };

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="languages"
        render={({ field }) => {
          const value = field.value || [];

          return (
            <div className="space-y-4">
              <p className="text-xs text-primary/50 uppercase tracking-widest font-semibold after:ms-1 after:text-destructive after:content-['*']">
                {t("Fields.Languages.Label")}
              </p>

              <div className="flex flex-wrap gap-2">
                {referenceData?.languages.map((language) => (
                  <Button
                    type="button"
                    variant="outline"
                    key={language}
                    onClick={() => {
                      if (value.includes(language)) {
                        field.onChange(value.filter((id) => id !== language));
                        return;
                      }
                      field.onChange([...value, language]);
                    }}
                    className={cn(
                      "rounded-xs border-primary/10 text-primary/35 text-xs h-9 px-4 font-normal hover:bg-accent/20 hover:text-accent",
                      value.includes(language) && "bg-accent/20 text-accent",
                    )}
                  >
                    {value.includes(language) && <Check />}
                    {language}
                  </Button>
                ))}
              </div>

              <FieldError errors={[errors.languages]} />
            </div>
          );
        }}
      />

      <FormTextarea
        register={register}
        name="bio"
        label={t("Fields.Bio.Label")}
        placeholder={t("Fields.Bio.Placeholder")}
        textareaClassName="bg-background border border-accent/20!"
        description={t("Fields.Bio.Description")}
      />

      <FormInput
        type="url"
        register={register}
        name="website_url"
        label={t("Fields.WebsiteUrl.Label")}
        placeholder={t("Fields.WebsiteUrl.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
        description={t("Fields.WebsiteUrl.Description")}
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
