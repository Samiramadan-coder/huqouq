"use client";

import z from "zod";
import { toast } from "sonner";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { deliverWork } from "@/lib/lawyer/legal-services";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";

const deliverWorkSchema = (t: T) =>
  z.object({
    files: z
      .array(z.instanceof(File))
      .min(1, t("pleaseUploadAtLeastOneDocument")),
    note: z.string().optional(),
  });

export type DeliverWorkFormValues = z.infer<
  ReturnType<typeof deliverWorkSchema>
>;

export default function DeliverWork({ serviceId }: { serviceId: number }) {
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
      result = await deliverWork(data, serviceId);
    } catch {
      // The request itself failed (network, upload too large, ...)
      toast.error(t("deliverWorkError"));
      return;
    }

    if (result.success) {
      toast.success(result.message);
      // Clear the form so the same files can't be delivered twice
      reset();
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
    <div className="bg-white border border-secondary rounded-sm p-5">
      <h2 className="font-sans text-[10px] font-semibold uppercase text-primary/35 mb-4">
        {t("deliverWork")}
      </h2>

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
          label={t("markAsDelivered")}
          loading={isSubmitting}
          className="h-12 bg-accent text-white hover:bg-accent/90"
        />
      </form>
    </div>
  );
}
