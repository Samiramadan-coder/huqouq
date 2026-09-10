"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitOffer } from "@/lib/lawyer/browse-cases";
import { useForm, SubmitHandler } from "react-hook-form";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { OfferFormData, offerFormSchema } from "@/types/lawyer/browse-cases";
import DeclineOffer from "./decline-offer";

export default function OfferForm({
  caseId,
  hire = false,
}: {
  caseId: number;
  hire?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("Lawyer.BrowseCases");
  const tFields = useTranslations("Lawyer.BrowseCases.Fields");

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema(tFields)),
    defaultValues: {
      amount: undefined,
      message: "",
    },
  });

  const onSubmit: SubmitHandler<OfferFormData> = async (data) => {
    const result = await submitOffer(
      data,
      caseId,
      hire ? `/api/lawyer/hire-requests/${caseId}/accept` : undefined,
    );

    if (result.success) {
      toast.success(result.message);
      router.push(`/lawyer/my-offers`);
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

    toast.error(t("SubmitOfferError"));
  };

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        required
        errors={errors}
        register={register}
        name="amount"
        type="number"
        label={tFields("ProposedPrice.Label")}
        placeholder={tFields("ProposedPrice.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
      />

      <FormInput
        required
        errors={errors}
        register={register}
        name="expected_days"
        type="number"
        label={tFields("EstimatedTimeline.Label")}
        placeholder={tFields("EstimatedTimeline.Placeholder")}
        inputClassName="bg-background border border-accent/20!"
      />

      <FormTextarea
        register={register}
        errors={errors}
        required
        name="message"
        label={tFields("Message.Label")}
        placeholder={tFields("Message.Placeholder")}
        className="sm:col-span-2"
        textareaClassName="bg-background border border-accent/20!"
        description={tFields("Message.Description")}
      />

      <div className="sm:col-span-2 flex gap-2 justify-end">
        {hire && <DeclineOffer caseId={caseId} />}

        <SubmitBtn
          label={t("SubmitOffer")}
          loading={isSubmitting}
          className="w-40 h-10"
        />
      </div>
    </form>
  );
}
