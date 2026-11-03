"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  REPORT_REASONS,
  reportFormSchema,
  Consultation,
  ReportConsultationForm,
} from "@/types/client/consultation";

import { cn } from "cn";
import { toast } from "sonner";
import { useState } from "react";
import { Flag } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportConsultation } from "@/lib/client/consultations";
import FormSelect from "@/components/public/shared/form/form-select";
import FormTextarea from "@/components/public/shared/form/form-textarea";

export default function ReportConsultation({
  consultation,
  triggerClassName,
}: {
  consultation: Consultation;
  triggerClassName?: string;
}) {
  const t = useTranslations("Client.Consultations.Report");
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReportConsultationForm>({
    resolver: zodResolver(reportFormSchema(t)),
    defaultValues: {
      reason: undefined,
      details: "",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  async function onSubmit(values: ReportConsultationForm) {
    const result = await reportConsultation(consultation.id, values);

    if (result.success) {
      toast.success(result.message);
      handleOpenChange(false);
      return;
    }

    if (result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        setError(field as keyof ReportConsultationForm, { message });
      }
    }

    toast.error(result.message ?? t("failed"));
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-sm border-destructive/30 bg-transparent text-destructive font-normal text-xs hover:bg-destructive/5 hover:text-destructive",
            triggerClassName,
          )}
        >
          <Flag className="size-3" aria-hidden="true" />
          {t("trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm ring-0! rounded-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="mt-1">
            {consultation.lawyer.name} · {consultation.type_label} ·{" "}
            {consultation.date_label}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            control={control}
            name="reason"
            label={t("reasonLabel")}
            placeholder={t("reasonPlaceholder")}
            required
            options={REPORT_REASONS.map((reason) => ({
              value: reason,
              label: t(`reasons.${reason}`),
            }))}
          />

          <FormTextarea
            register={register}
            errors={errors}
            name="details"
            label={t("detailsLabel")}
            placeholder={t("detailsPlaceholder")}
            required
            textareaClassName="border border-secondary"
          />

          <div>
            <Button
              className="w-full bg-destructive text-white rounded-sm h-12 hover:bg-destructive/90"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {t("submit")}
            </Button>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                className="w-full h-12 text-primary/50 text-xs"
              >
                {t("cancel")}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
