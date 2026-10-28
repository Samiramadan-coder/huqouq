"use client";

import z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { addDeliveryFiles, deliverWork } from "@/lib/lawyer/legal-services";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { useFormatters } from "@/lib/format";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";

const MAX_FILES = 10;

const deliverWorkSchema = (t: T) =>
  z.object({
    files: z
      .array(z.instanceof(File))
      .min(1, t("pleaseUploadAtLeastOneDocument"))
      .max(MAX_FILES, t("maxFiles")),
    note: z.string().optional(),
  });

export type DeliverWorkFormValues = z.infer<
  ReturnType<typeof deliverWorkSchema>
>;

type DeliverWorkProps = { serviceId: number } & (
  | {
      // In progress: first delivery, or a revised one after a revision request
      mode: "deliver";
      revisionNote?: string | null;
      // The round this delivery will be
      roundNumber: number;
    }
  | {
      // Delivered: waiting for the client, more files can still be added
      mode: "addFiles";
      deliveredAt: string | null;
      canAddFiles: boolean;
    }
);

export default function DeliverWork(props: DeliverWorkProps) {
  const t = useTranslations("Lawyer.ActiveServices.Details");
  const format = useFormatters();
  const [showForm, setShowForm] = useState(props.mode === "deliver");

  if (props.mode === "addFiles") {
    return (
      <div className="bg-white border border-secondary rounded-sm p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-primary/70">
            {props.deliveredAt
              ? t("deliveredWaiting", { date: format.date(props.deliveredAt) })
              : t("waitingForClient")}
          </p>
          {props.canAddFiles && !showForm && (
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={() => setShowForm(true)}
            >
              {t("addMoreFiles")}
            </Button>
          )}
        </div>

        {props.canAddFiles && showForm && (
          <DeliveryForm
            serviceId={props.serviceId}
            action={addDeliveryFiles}
            submitLabel={t("uploadFiles")}
            onDone={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  const isRevision = !!props.revisionNote;

  return (
    <div
      className={cn(
        "bg-white border rounded-sm overflow-hidden",
        isRevision ? "border-amber-200" : "border-secondary",
      )}
    >
      {isRevision && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-start gap-3">
          <RotateCcw
            className="size-5 text-amber-600 shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 mb-3">
              {t("revisionRequestedRound", {
                round: format.number(props.roundNumber - 1),
              })}
            </p>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-amber-700/60 mb-1">
              {t("clientRevisionNote")}
            </p>
            <p className="text-sm text-amber-900/80 leading-relaxed whitespace-pre-line wrap-break-word border-s-2 border-amber-400 ps-3">
              {props.revisionNote}
            </p>
          </div>
        </div>
      )}

      <div className="p-5">
        <h2 className="font-sans text-[10px] font-semibold uppercase text-primary/35 mb-4">
          {isRevision
            ? t("revisedDeliveryRound", {
                round: format.number(props.roundNumber),
              })
            : t("deliverWork")}
        </h2>

        <DeliveryForm
          serviceId={props.serviceId}
          action={deliverWork}
          submitLabel={t(isRevision ? "sendRevisedDelivery" : "markAsDelivered")}
        />
      </div>
    </div>
  );
}

function DeliveryForm({
  serviceId,
  action,
  submitLabel,
  onDone,
}: {
  serviceId: number;
  action: typeof deliverWork;
  submitLabel: string;
  onDone?: () => void;
}) {
  const t = useTranslations("Lawyer.ActiveServices.Details");

  const {
    control,
    handleSubmit,
    register,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<DeliverWorkFormValues>({
    resolver: zodResolver(deliverWorkSchema(t)),
    defaultValues: {
      files: [],
      note: "",
    },
  });

  const onSubmit: SubmitHandler<DeliverWorkFormValues> = async (data) => {
    let result: Awaited<ReturnType<typeof deliverWork>>;

    try {
      result = await action(data, serviceId);
    } catch {
      // The request itself failed (network, upload too large, ...)
      toast.error(t("deliverWorkError"));
      return;
    }

    if (result.success) {
      toast.success(result.message);
      // Clear the form so the same files can't be delivered twice
      reset();
      onDone?.();
      return;
    }

    Object.entries(result.errors ?? {}).forEach(([field, message]) => {
      if (!message) return;
      setError(field as keyof DeliverWorkFormValues, {
        type: "server",
        message,
      });
    });

    toast.error(result.message ?? t("deliverWorkError"));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <SingleFormFileUploader
        control={control}
        name="files"
        label={t("deliveries")}
        required
        multiple
        uploadButtonClassName="bg-white"
        previewBlockClassName="bg-white"
      />

      <FormTextarea
        register={register}
        errors={errors}
        name="note"
        label={t("note")}
        placeholder={t("notePlaceholder")}
        className="sm:col-span-2"
        textareaClassName="border border-accent/20!"
      />

      <SubmitBtn
        label={submitLabel}
        loading={isSubmitting}
        className="h-12 bg-accent text-white hover:bg-accent/90"
      />
    </form>
  );
}
