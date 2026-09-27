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
    formState: { isSubmitting },
  } = useForm<DeliverWorkFormValues>({
    resolver: zodResolver(deliverWorkSchema(t)),
    defaultValues: {
      files: [],
      note: "",
    },
  });

  const onSubmit: SubmitHandler<DeliverWorkFormValues> = async (data) => {
    const result = await deliverWork(data, serviceId);

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
        setError(field as keyof DeliverWorkFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("deliverWorkError"));
  };

  return (
    <div className="bg-white border border-secondary rounded-sm p-5">
      <p className="font-sans text-[10px] font-semibold uppercase text-primary/35 mb-4">
        {t("deliverWork")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <SingleFormFileUploader
          control={control}
          name="files"
          multiple
          uploadButtonClassName="bg-white"
          previewBlockClassName="bg-white"
        />

        <FormTextarea
          register={register}
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
