"use client";

import {
  LegalServiceDetails,
  PostLegalServiceFormData,
  postLegalServiceShema,
} from "@/types/client/legal-services";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Hint from "../../reusable/hint";
import Title from "../../reusable/title";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CircleCheck, Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { postLegalService } from "@/lib/client/legal-services";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormSelect from "@/components/public/shared/form/form-select";
import { useReferenceData } from "@/providers/reference-data.provider";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";

const urgencyKeys = ["standard", "urgent", "very_urgent"] as const;

export default function Form({
  legalServiceItem,
}: {
  legalServiceItem?: LegalServiceDetails;
}) {
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const { referenceData } = useReferenceData();
  const t = useTranslations("Client.LegalServices");
  const tFields = useTranslations("Client.LegalServices.Fields");

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<PostLegalServiceFormData>({
    resolver: zodResolver(postLegalServiceShema(tFields)),
    defaultValues: {
      service_type: legalServiceItem?.service_type ?? "",
      description: legalServiceItem?.description ?? "",
      urgency: legalServiceItem?.urgency ?? "standard",
      emirate: legalServiceItem?.emirate ?? "",
      documents:
        legalServiceItem?.attachments.map((doc) => doc.download_url) ?? [],
    },
  });

  // Watch the description field to dynamically respond to its changes if needed
  const description = useWatch({ control, name: "description" });

  // Handle form submission
  const onSubmit: SubmitHandler<PostLegalServiceFormData> = async (data) => {
    const result = await postLegalService(data, legalServiceItem?.id);

    if (result.success) {
      toast.success(result.message);
      router.back();
      return;
    }

    if (result.message) {
      toast.error(result.message);
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        setError(field as keyof PostLegalServiceFormData, {
          type: "manual",
          message: message as string,
        });
      });
      return;
    }

    toast.error(
      legalServiceItem ? tCommon("EditFailed") : tCommon("CreationFailed"),
    );
  };

  return (
    <div className="container max-w-3xl space-y-6 py-10">
      <div>
        <Title>{legalServiceItem ? t("edit") : t("create")}</Title>
        <Hint>
          {legalServiceItem ? t("editServiceHint") : t("createServiceHint")}
        </Hint>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSelect
          control={control}
          required
          name="service_type"
          label={tFields("type.label")}
          placeholder={tFields("type.placeholder")}
          triggerClassName="bg-white border border-accent/20!"
          options={
            referenceData?.legal_service_types.map((service) => ({
              label: service.label,
              value: service.value,
            })) || []
          }
        />

        <FormTextarea
          register={register}
          errors={errors}
          name="description"
          required
          label={tFields("description.label")}
          placeholder={tFields("description.placeholder")}
          textareaClassName="bg-white border border-accent/20! h-40"
          labelDescription={
            <div className="p-3 border border-secondary flex items-center gap-2">
              <CircleCheck className="size-3.5 text-accent" />
              <p className="text-xs text-primary/55">
                {tFields("description.notice")}
              </p>
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
            {tFields("urgency.label")}
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
                        {tFields(`urgency.options.${key}.label`)}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] leading-tight text-center text-primary/40 mt-1 group-hover:text-white/70",
                          value === key && "text-white/70",
                        )}
                      >
                        {tFields(`urgency.options.${key}.description`)}
                      </span>
                    </Button>
                  ))}
                </div>
              );
            }}
          />
        </div>

        <FormSelect
          control={control}
          required
          name="emirate"
          label={tFields("location.label")}
          placeholder={tFields("location.placeholder")}
          triggerClassName="bg-white border border-accent/20!"
          options={
            referenceData?.cities.map((item) => ({
              label: item.emirate,
              value: item.emirate,
            })) || []
          }
        />

        <SingleFormFileUploader
          control={control}
          name="documents"
          multiple
          label={tFields("documents.label")}
          uploadButtonClassName="bg-white"
          previewBlockClassName="bg-white"
        />

        <Alert className="bg-transparent rounded-xs border-secondary">
          <Info className="text-accent!" />
          <AlertDescription className="text-sm text-primary/60 leading-relaxed">
            {tFields("recieveHint")}
          </AlertDescription>
        </Alert>

        <div>
          <SubmitBtn
            label={tFields("submit.button")}
            className="bg-accent"
            loading={isSubmitting}
          />
          <p className="text-xs text-primary/35 text-center mt-2">
            {tFields("submit.disabledMessage")}
          </p>
        </div>
      </form>
    </div>
  );
}
