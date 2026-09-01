"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { postCase } from "@/lib/client/cases";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import { PostCaseFormData, postCaseShema } from "@/types/client/cases";
import { useReferenceData } from "@/providers/reference-data.provider";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";

const urgencyKeys = ["standard", "urgent", "veryUrgent"] as const;

export default function Form() {
  const { referenceData } = useReferenceData();
  const t = useTranslations("Client.Cases.Fields");
  const tCommon = useTranslations("Common");
  const tProfile = useTranslations("Client.Profile.Fields.City.Options");

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PostCaseFormData>({
    resolver: zodResolver(postCaseShema(t)),
    defaultValues: {
      title: "",
      specialization_id: undefined,
      description: "",
      urgency: "standard",
      budget_min: undefined,
      budget_max: undefined,
      city: "",
      documents: [],
    },
  });

  const description = useWatch({ control, name: "description" });

  const onSubmit: SubmitHandler<PostCaseFormData> = async (data) => {
    const result = await postCase(data);

    if (result.success) {
      toast.success(tCommon("CreatedSuccessfully"));
      reset();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof PostCaseFormData, {
          type: "manual",
          message: message as string,
        });
      });

      return;
    }

    toast.error(tCommon("CreationFailed"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        required
        register={register}
        errors={errors}
        name="title"
        label={t("caseTitle.label")}
        placeholder={t("caseTitle.placeholder")}
        inputClassName="bg-white border border-accent/20!"
      />

      <FormSelect
        control={control}
        required
        name="specialization_id"
        label={t("category.label")}
        placeholder={t("category.placeholder")}
        triggerClassName="bg-white border border-accent/20!"
        options={
          referenceData?.specializations.map((service) => ({
            label: service.name,
            value: service.id,
          })) || []
        }
      />

      <FormTextarea
        register={register}
        errors={errors}
        name="description"
        required
        label={t("description.label")}
        placeholder={t("description.placeholder")}
        textareaClassName="bg-white border border-accent/20! h-40"
        labelDescription={
          <div className="p-3 border border-secondary flex items-center gap-2">
            <CircleCheck className="size-3.5 text-accent" />
            <p className="text-xs text-primary/55">{t("description.notice")}</p>
          </div>
        }
        description={
          <span className="text-xs flex justify-end">
            <span>{description?.length || 0}/2000</span>
          </span>
        }
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/50 mb-2">
          {t("urgency.label")}
        </p>
        <Controller
          control={control}
          name="urgency"
          render={({ field }) => {
            const { value, onChange } = field;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {urgencyKeys.map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    type="button"
                    className={cn(
                      "group py-4 px-2 border-secondary rounded-sm flex flex-col min-h-14.5 hover:bg-primary hover:text-white",
                      value === key && "bg-primary text-white",
                    )}
                    onClick={() => onChange(key)}
                  >
                    <span className="text-sm font-semibold leading-none">
                      {t(`urgency.options.${key}.label`)}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] leading-tight text-center text-primary/40 mt-1 group-hover:text-white/70",
                        value === key && "text-white/70",
                      )}
                    >
                      {t(`urgency.options.${key}.description`)}
                    </span>
                  </Button>
                ))}
              </div>
            );
          }}
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/50 mb-2">
          {t("budget.label")} ({t("budget.optional")})
        </p>
        <div className="grid items-center grid-cols-1 sm:grid-cols-[0.95fr_0.1fr_0.95fr] gap-4">
          <FormInput
            register={register}
            errors={errors}
            name="budget_min"
            type="number"
            inputClassName="bg-white border border-accent/20!"
            prefix={tCommon("AED")}
            placeholder={t("budget.Min")}
          />
          <span className="text-center text-primary/50">{t("budget.to")}</span>
          <FormInput
            register={register}
            errors={errors}
            name="budget_max"
            type="number"
            inputClassName="bg-white border border-accent/20!"
            prefix={tCommon("AED")}
            placeholder={t("budget.Max")}
          />
        </div>
      </div>

      <FormSelect
        control={control}
        required
        name="city"
        label={t("location.label")}
        placeholder={t("location.placeholder")}
        triggerClassName="bg-white border border-accent/20!"
        options={[
          {
            label: tProfile("Dubai"),
            value: "Dubai Marina",
          },
          {
            label: tProfile("AbuDhabi"),
            value: "abu-dhabi",
          },
          {
            label: tProfile("Sharjah"),
            value: "sharjah",
          },
          {
            label: tProfile("Ajman"),
            value: "ajman",
          },
          {
            label: tProfile("UmmAlQuwain"),
            value: "umm-al-quwain",
          },
          {
            label: tProfile("RasAlKhaimah"),
            value: "ras-al-khaimah",
          },
          {
            label: tProfile("Fujairah"),
            value: "fujairah",
          },
        ]}
      />

      <SingleFormFileUploader
        control={control}
        name="documents"
        multiple
        label={t("documents.label")}
        uploadButtonClassName="bg-white"
        previewBlockClassName="bg-white"
      />

      <SubmitBtn
        label={t("submit.button")}
        className="bg-accent"
        loading={isSubmitting}
      />
    </form>
  );
}
