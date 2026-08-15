"use client";

import {
  LawyerProfile,
  certificateUploadSchema,
  CertificateUploadFormValues,
} from "@/types/lawyer/dashboard";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import SingleFormFileUploader from "@/components/public/shared/form/file-uploader";
import { updateCertificate } from "@/lib/lawyer/dashboard";
import { toast } from "sonner";

export default function BarCertificate({
  profile,
}: {
  profile: LawyerProfile["profile"];
}) {
  const t = useTranslations("Lawyer.Dashboard.BarCertificate");
  const tDashboard = useTranslations("Lawyer.Dashboard");

  const {
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CertificateUploadFormValues>({
    resolver: zodResolver(certificateUploadSchema(t)),
    defaultValues: {
      certificate: profile.bar_certificate_url || undefined,
    },
  });

  const onSubmit: SubmitHandler<CertificateUploadFormValues> = async (data) => {
    const result = await updateCertificate(data);

    if (result.success) {
      toast.success(t("Messages.CertificateUpdated"));
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof CertificateUploadFormValues, {
          type: "server",
          message,
        });
      });

      return;
    }

    toast.error(t("Messages.CertificateUpdateFailed"));
  };

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
      <SingleFormFileUploader
        control={control}
        name="certificate"
        label={t("Fields.Certificate.Label")}
        description={t("Fields.Certificate.Description")}
      />

      <div className="flex justify-end">
        <SubmitBtn
          label={tDashboard("SaveSection")}
          loading={isSubmitting}
          showArrow={false}
          className="min-w-35 w-auto h-9 px-5"
        />
      </div>
    </form>
  );
}
