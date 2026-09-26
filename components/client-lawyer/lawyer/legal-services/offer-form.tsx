"use client";

import { useTranslations } from "next-intl";
import { FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import FormSelect from "@/components/public/shared/form/form-select";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { OfferFormData, offerSchema } from "@/types/lawyer/legal-services";
import { submitOffer } from "@/lib/lawyer/legal-services";
import { toast } from "sonner";

export default function OfferForm({ serviceId }: { serviceId: number }) {
  const t = useTranslations("Lawyer.LegalServices.Details.OfferForm");

  const {
    control,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema(t)),
    defaultValues: {
      fee: undefined,
      delivery_amount: undefined,
      delivery_unit: "days",
      message: "",
    },
  });

  const message = useWatch({ control, name: "message" });

  const onSubmit: SubmitHandler<OfferFormData> = async (data) => {
    const result = await submitOffer(data, serviceId);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.message) {
      toast.error(result.message);
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        setError(field as keyof OfferFormData, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("submitOfferError"));
  };

  return (
    <form
      className="px-5 py-5 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        required
        errors={errors}
        register={register}
        name="fee"
        type="number"
        label={t("fee.label")}
        placeholder={t("fee.placeholder")}
        inputClassName="bg-background border border-accent/20! placeholder:text-sm"
      />

      <div className="space-y-2">
        <div>
          <FieldLabel className="text-xs text-primary/50 uppercase tracking-widest font-semibold">
            {t("delivery_time.label")}
          </FieldLabel>
        </div>

        <div className="flex items-stretch gap-2">
          <FormInput
            required
            errors={errors}
            register={register}
            name="delivery_amount"
            type="number"
            placeholder={t("delivery_time.placeholder")}
            inputClassName="bg-background border border-accent/20! flex-1 placeholder:text-sm"
          />

          <FormSelect
            control={control}
            required
            name="delivery_unit"
            triggerClassName="bg-background border border-accent/20!"
            options={[
              { label: t("delivery_time.options.days"), value: "days" },
              { label: t("delivery_time.options.weeks"), value: "weeks" },
            ]}
          />
        </div>

        <FormTextarea
          register={register}
          errors={errors}
          required
          name="message"
          label={t("message.label")}
          placeholder={t("message.placeholder")}
          className="sm:col-span-2"
          textareaClassName="bg-background border border-accent/20! placeholder:text-sm"
          description={t("message.description", { count: message.length })}
        />

        <SubmitBtn
          label={t("submitOffer")}
          loading={isSubmitting}
          className="bg-accent hover:bg-accent/90"
        />
      </div>
    </form>
  );
}
