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
  Consultation,
  respondToReportSchema,
  RespondToReportFormValues,
} from "@/types/lawyer/consultations";

import { toast } from "sonner";
import { useState } from "react";
import { Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { respondToReport } from "@/lib/lawyer/consultations";
import FormTextarea from "@/components/public/shared/form/form-textarea";

export default function RespondToReport({
  consultation,
}: {
  consultation: Consultation;
}) {
  const t = useTranslations("Lawyer.Consultations.Bookings.RespondToReport");
  const format = useFormatters();
  const [open, setOpen] = useState(false);
  const { report } = consultation;

  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RespondToReportFormValues>({
    resolver: zodResolver(respondToReportSchema(t)),
    defaultValues: { details: "" },
  });

  // Start from a clean form every time the dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  const onSubmit: SubmitHandler<RespondToReportFormValues> = async (
    values,
  ) => {
    let result: Awaited<ReturnType<typeof respondToReport>>;

    try {
      result = await respondToReport(consultation.id, values);
    } catch {
      toast.error(t("Failed"));
      return;
    }

    if (result.success) {
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    if (result.errors?.details) {
      setError("details", { type: "manual", message: result.errors.details });
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
          <Flag className="size-3" aria-hidden="true" />
          {t("Trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm max-h-[90vh] grid-cols-[minmax(0,1fr)] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Title")}</DialogTitle>
          <DialogDescription className="mt-3">
            {report?.respond_by
              ? t("DescriptionWithDeadline", {
                  date: format.date(report.respond_by),
                })
              : t("Description")}
          </DialogDescription>
        </DialogHeader>

        {/* The client's report, so the lawyer knows what they are answering */}
        {report && (
          <div className="bg-background border-s-2 border-destructive/60 px-4 py-3 space-y-1.5 min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-primary/40">
              {t("ClientReport")}
            </p>
            <p className="text-sm font-medium text-primary">
              {report.reason_label}
            </p>
            {report.details && (
              <p className="text-sm text-primary/60 leading-relaxed wrap-break-word">
                {report.details}
              </p>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-0 space-y-4"
          noValidate
        >
          <FormTextarea
            register={register}
            errors={errors}
            name="details"
            required
            label={t("DetailsLabel")}
            placeholder={t("DetailsPlaceholder")}
            textareaClassName="border border-secondary"
          />

          <DialogFooter className="bg-white border-none">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-white hover:bg-accent/90 rounded-sm h-11 flex-1"
            >
              {isSubmitting && <Spinner />}
              {t("Submit")}
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
