"use client";

import z from "zod";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import type { PayoutDetailsType } from "@/types/lawyer/settings";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import FormInput from "@/components/public/shared/form/form-input";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { updatePayoutDetails } from "@/lib/lawyer/settings";
import { toast } from "sonner";

const payoutDetailsSchema = (t: T) =>
  z.object({
    iban: z.string().min(1, "IBAN is required"),
    account_name: z.string().min(1, "Account name is required"),
  });

export type PayoutDetailsSchemaType = z.infer<
  ReturnType<typeof payoutDetailsSchema>
>;

export default function PayoutDetails({
  payoutDetails,
}: {
  payoutDetails: PayoutDetailsType;
}) {
  const t = useTranslations("Lawyer.Settings");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PayoutDetailsSchemaType>({
    resolver: zodResolver(payoutDetailsSchema(t)),
    defaultValues: {
      iban: payoutDetails.iban ?? "",
      account_name: payoutDetails.account_name ?? "",
    },
  });

  const onSubmit: SubmitHandler<PayoutDetailsSchemaType> = async (data) => {
    const result = await updatePayoutDetails(data);

    if (result.success) {
      toast.success(result.message);
      setIsEditMode(false);
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([key, message]) => {
        setError(key as keyof PayoutDetailsSchemaType, {
          type: "manual",
          message,
        });
      });
    }
  };

  return (
    <div className="bg-white p-5 border border-secondary flex items-start gap-6">
      {/* Data Preview */}
      {!isEditMode && (
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-sm text-primary font-semibold">
            IBAN:{" "}
            <span className="font-normal">
              {payoutDetails.iban || (
                <span className="text-primary/50">N/A</span>
              )}
            </span>
          </p>
          <p className="text-sm text-primary font-semibold">
            Account Name:{" "}
            <span className="font-normal">
              {payoutDetails.account_name || (
                <span className="text-primary/50">N/A</span>
              )}
            </span>
          </p>
        </div>
      )}

      {/* Edit Mode Form */}
      {isEditMode && (
        <form
          className="flex-1 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInput
            register={register}
            name="iban"
            label="IBAN"
            errors={errors}
            required
            inputClassName="bg-background border border-secondary"
          />

          <FormInput
            register={register}
            name="account_name"
            label="Account Name"
            errors={errors}
            required
            inputClassName="bg-background border border-secondary"
          />

          <SubmitBtn
            label="Save Changes"
            className="bg-accent"
            loading={isSubmitting}
          />
        </form>
      )}

      {/* Edit and Cancel buttons */}
      <div>
        {isEditMode ? (
          <Button
            variant="outline"
            className="bg-transparent rounded-sm border-destructive/50 text-xs text-destructive/80 hover:bg-transparent"
            onClick={() => setIsEditMode(false)}
          >
            <Edit />
            Cancel
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-transparent rounded-sm border-secondary text-xs text-primary/70 hover:bg-transparent"
            onClick={() => setIsEditMode(true)}
          >
            <Edit />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
