"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  cancelConsultationSchema,
  CancelConsultationFormValues,
} from "@/types/lawyer/consultations";

import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { cancelConsultation } from "@/lib/lawyer/consultations";
import FormTextarea from "@/components/public/shared/form/form-textarea";

export default function CancelConsultation({
  consultationId,
}: {
  consultationId: number;
}) {
  const t = useTranslations("Lawyer.Consultations.Bookings.Cancel");
  const [open, setOpen] = useState(false);

  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CancelConsultationFormValues>({
    resolver: zodResolver(cancelConsultationSchema(t)),
    defaultValues: { reason: "" },
  });

  // Start from a clean form every time the dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  const onSubmit: SubmitHandler<CancelConsultationFormValues> = async (
    values,
  ) => {
    let result: Awaited<ReturnType<typeof cancelConsultation>>;

    try {
      result = await cancelConsultation(consultationId, values);
    } catch {
      toast.error(t("Failed"));
      return;
    }

    if (result.success) {
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    if (result.errors?.reason) {
      setError("reason", { type: "manual", message: result.errors.reason });
    }

    toast.error(result.message ?? t("Failed"));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 rounded-sm border-destructive/20 bg-transparent px-3 text-xs font-normal text-destructive/80 hover:bg-destructive/5 hover:text-destructive"
        >
          {t("Trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("Title")}</DialogTitle>
          <DialogDescription className="mt-3">
            {t("Description")}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormTextarea
            register={register}
            errors={errors}
            name="reason"
            required
            label={t("ReasonLabel")}
            placeholder={t("ReasonPlaceholder")}
            textareaClassName="border border-secondary"
          />

          <DialogFooter className="bg-white border-none">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-destructive text-white border-secondary hover:bg-destructive/20 hover:text-destructive rounded-sm h-11 flex-1"
            >
              {isSubmitting && <Spinner />}
              {t("Confirm")}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="bg-transparent border-secondary rounded-sm h-11 flex-1"
              >
                {t("Back")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
