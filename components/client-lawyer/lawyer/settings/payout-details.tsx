"use client";

import {
  PayoutDetailsType,
  payoutDetailsSchema,
  PayoutDetailsFormValues,
} from "@/types/lawyer/settings";
import { toast } from "sonner";
import { useState } from "react";
import { Edit, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { updatePayoutDetails } from "@/lib/lawyer/settings";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import SectionCard from "@/components/client-lawyer/lawyer/consultations/section-card";

// Groups an IBAN into blocks of four for readability
const formatIban = (iban: string) => iban.replace(/(.{4})(?=.)/g, "$1 ");

export default function PayoutDetails({
  payoutDetails,
}: {
  payoutDetails: PayoutDetailsType;
}) {
  const t = useTranslations("Lawyer.Settings.PayoutDetails");
  const [isEditMode, setIsEditMode] = useState(!payoutDetails.provided);

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PayoutDetailsFormValues>({
    resolver: zodResolver(payoutDetailsSchema(t)),
    defaultValues: {
      account_name: payoutDetails.account_name ?? "",
      iban: payoutDetails.iban ?? "",
    },
  });

  const onCancel = () => {
    reset();
    setIsEditMode(false);
  };

  const onSubmit: SubmitHandler<PayoutDetailsFormValues> = async (values) => {
    let result: Awaited<ReturnType<typeof updatePayoutDetails>>;

    try {
      result = await updatePayoutDetails(values);
    } catch {
      toast.error(t("Messages.UpdateFailed"));
      return;
    }

    if (result.success) {
      toast.success(result.message || t("Messages.Updated"));
      // Keep the saved values as the baseline for a later cancel
      reset(values);
      setIsEditMode(false);
      return;
    }

    Object.entries(result.errors ?? {}).forEach(([field, message]) => {
      if (!message) return;
      setError(field as keyof PayoutDetailsFormValues, {
        type: "server",
        message,
      });
    });

    toast.error(result.message ?? t("Messages.UpdateFailed"));
  };

  return (
    <SectionCard title={t("Title")}>
      <div className="flex flex-col-reverse sm:flex-row sm:items-start gap-4 sm:gap-6">
        {isEditMode ? (
          <form
            noValidate
            className="flex-1 grid grid-cols-1 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput
              required
              errors={errors}
              register={register}
              name="account_name"
              autoComplete="name"
              label={t("Fields.AccountName.Label")}
              placeholder={t("Fields.AccountName.Placeholder")}
              disabled={isSubmitting}
              inputClassName="bg-background border border-secondary"
            />

            <FormInput
              required
              dir="ltr"
              errors={errors}
              register={register}
              name="iban"
              autoComplete="off"
              maxLength={42}
              label={t("Fields.Iban.Label")}
              placeholder={t("Fields.Iban.Placeholder")}
              description={t("Fields.Iban.Description")}
              disabled={isSubmitting}
              inputClassName="bg-background border border-secondary uppercase rtl:text-end"
            />

            <div className="flex justify-end">
              <SubmitBtn
                label={t("Save")}
                loading={isSubmitting}
                showArrow={false}
                className="bg-accent min-w-35 w-auto h-10 px-5"
              />
            </div>
          </form>
        ) : (
          <dl className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <dt className="text-xs text-primary/50 uppercase tracking-widest font-semibold">
                {t("Fields.AccountName.Label")}
              </dt>
              <dd className="text-sm text-primary wrap-break-word">
                {payoutDetails.account_name || (
                  <span className="text-primary/50">{t("NotProvided")}</span>
                )}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-xs text-primary/50 uppercase tracking-widest font-semibold">
                {t("Fields.Iban.Label")}
              </dt>
              <dd className="text-sm text-primary break-all">
                {payoutDetails.iban ? (
                  <span dir="ltr">{formatIban(payoutDetails.iban)}</span>
                ) : (
                  <span className="text-primary/50">{t("NotProvided")}</span>
                )}
              </dd>
            </div>
          </dl>
        )}

        <div className="flex justify-end">
          {isEditMode ? (
            payoutDetails.provided && (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="bg-transparent rounded-sm border-destructive/50 text-xs text-destructive/80 hover:bg-transparent"
                onClick={onCancel}
              >
                <X />
                {t("Cancel")}
              </Button>
            )
          ) : (
            <Button
              type="button"
              variant="outline"
              className="bg-transparent rounded-sm border-secondary text-xs text-primary/70 hover:bg-transparent"
              onClick={() => setIsEditMode(true)}
            >
              <Edit />
              {t("Edit")}
            </Button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
