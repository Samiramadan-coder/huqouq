"use client";

import { toast } from "sonner";
import { Info } from "lucide-react";
import { toSnakeCase } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertEmergencyToCase } from "@/lib/client/emergency";
import FormInput from "@/components/public/shared/form/form-input";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { useReferenceData } from "@/providers/reference-data.provider";
import {
  Emergency,
  EmergencyCaseForm,
  emergencyCaseSchema,
} from "@/types/client/emergency";

// Turns an emergency into a case with the same lawyer. The client writes the
// title and description; the legal area, city and urgency come from the request.
// Used after the call and from the emergency history.
export default function EmergencyCaseFormStep({
  emergency,
  onDone,
}: {
  emergency: Emergency;
  // Closes without creating the case ("Maybe later"), or after creating it
  onDone: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const tCase = useTranslations("Client.Emergency.CallEnded.Case");
  const router = useRouter();
  const { referenceData } = useReferenceData();

  // The request only stores the emirate; its main city is the first listed
  const city = referenceData?.cities.find(
    ({ emirate }) => toSnakeCase(emirate) === emergency.emirate,
  )?.cities[0];

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyCaseForm>({
    resolver: zodResolver(emergencyCaseSchema(tCase)),
    defaultValues: { title: "", description: "" },
  });

  async function onSubmit(values: EmergencyCaseForm) {
    if (!city) {
      toast.error(t("failed"));
      return;
    }

    const response = await convertEmergencyToCase(emergency.id, {
      ...values,
      specialization_id: emergency.legal_area.id,
      city,
      urgency: "urgent",
    });

    if (!response.success) {
      for (const [field, message] of Object.entries(response.errors ?? {})) {
        setError(field as keyof EmergencyCaseForm, { message });
      }
      toast.error(response.message ?? t("failed"));
      return;
    }

    toast.success(response.message ?? tCase("success"));
    onDone();
    if (response.caseId) router.push(`/client/my-cases/${response.caseId}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm font-semibold text-primary">{tCase("title")}</p>

      {/* Fixed by the emergency request */}
      <dl className="grid grid-cols-3 gap-3 rounded-sm border border-secondary p-3 text-xs">
        <div className="space-y-1">
          <dt className="text-primary/40">{tCase("legalArea")}</dt>
          <dd className="text-primary/80">{emergency.legal_area.name}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-primary/40">{tCase("city")}</dt>
          <dd className="text-primary/80">{city ?? emergency.emirate_label}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-primary/40">{tCase("urgency")}</dt>
          <dd className="text-destructive">{tCase("urgent")}</dd>
        </div>
      </dl>

      <FormInput
        register={register}
        errors={errors}
        name="title"
        label={tCase("titleLabel")}
        placeholder={tCase("titlePlaceholder")}
        required
      />

      <FormTextarea
        register={register}
        errors={errors}
        name="description"
        label={tCase("descriptionLabel")}
        placeholder={tCase("descriptionPlaceholder")}
        textareaClassName="border border-secondary"
      />

      <p className="flex items-start gap-2 rounded-sm bg-secondary/30 px-3 py-2.5 text-xs text-primary/60">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {tCase("normalFlowNote")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={isSubmitting}
          className="h-11 rounded-sm border-secondary font-normal text-primary/60"
        >
          {tCase("maybeLater")}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-sm bg-accent"
        >
          {isSubmitting && <Spinner />}
          {tCase("submit")}
        </Button>
      </div>
    </form>
  );
}
