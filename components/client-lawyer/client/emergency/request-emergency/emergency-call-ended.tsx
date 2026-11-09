"use client";

import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Hourglass, PhoneOff } from "lucide-react";
import Rating from "@/components/client-lawyer/reusable/rating";
import { toSnakeCase } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/public/shared/form/form-input";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import { useReferenceData } from "@/providers/reference-data.provider";
import {
  Emergency,
  EmergencyCaseForm,
  emergencyCaseSchema,
} from "@/types/client/emergency";
import {
  rateEmergency,
  continueEmergency,
  convertEmergencyToCase,
} from "@/lib/client/emergency";
import {
  CallEndResult,
  formatSeconds,
} from "@/components/client-lawyer/reusable/call/config";

// The client's dialog after an emergency call, in two steps:
// 1. continue with this lawyer or not  2. (if continuing) rate + create a case
export default function EmergencyCallEnded({
  emergency,
  result,
  onDone,
}: {
  emergency: Emergency;
  result: CallEndResult;
  onDone: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const format = useFormatters();
  const emergencyId = emergency.id;
  // When the time limit ended the call, say so first, then continue
  const [step, setStep] = useState<"timeUp" | "continue" | "rate" | "case">(
    result.reason === "timeEnded" ? "timeUp" : "continue",
  );

  return (
    <>
      <DialogHeader className="p-6 border-b border-secondary items-center text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          {result.reason === "timeEnded" ? (
            <Hourglass className="size-5" aria-hidden="true" />
          ) : (
            <PhoneOff className="size-5" aria-hidden="true" />
          )}
        </span>

        <DialogTitle className="ltr:font-lora text-xl font-bold text-primary">
          {result.reason === "timeEnded"
            ? t("timeEndedTitle")
            : result.reason === "connectionLost"
              ? t("connectionLostTitle")
              : t("title")}
        </DialogTitle>

        <DialogDescription className="text-sm text-primary/55">
          {t("callDuration")}{" "}
          {format.digits(formatSeconds(result.durationSeconds))}
        </DialogDescription>
      </DialogHeader>

      <div className="p-6">
        {step === "timeUp" ? (
          <Button
            type="button"
            onClick={() => setStep("continue")}
            className="h-11 w-full rounded-sm"
          >
            {t("next")}
          </Button>
        ) : step === "continue" ? (
          <ContinueStep
            emergencyId={emergencyId}
            onContinue={() => setStep("rate")}
            onDone={onDone}
          />
        ) : step === "rate" ? (
          <RateStep
            emergencyId={emergencyId}
            onCreateCase={() => setStep("case")}
            onDone={onDone}
          />
        ) : (
          <CreateCaseStep
            emergency={emergency}
            onBack={() => setStep("rate")}
            onDone={onDone}
          />
        )}
      </div>
    </>
  );
}

// Step 1: continue with this lawyer?
function ContinueStep({
  emergencyId,
  onContinue,
  onDone,
}: {
  emergencyId: number;
  onContinue: () => void;
  onDone: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const [pending, setPending] = useState<"yes" | "no" | null>(null);

  async function answer(value: "yes" | "no") {
    setPending(value);
    const result = await continueEmergency(emergencyId, value);
    setPending(null);

    if (!result.success) {
      toast.error(result.message ?? t("failed"));
      return;
    }

    if (value === "yes") onContinue();
    else onDone();
  }

  return (
    <div className="space-y-5 text-center">
      <p className="text-sm font-semibold text-primary">
        {t("continueQuestion")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => answer("no")}
          disabled={pending !== null}
          className="h-11 rounded-sm border-secondary font-normal text-primary/60"
        >
          {pending === "no" && <Spinner />}
          {t("no")}
        </Button>

        <Button
          type="button"
          onClick={() => answer("yes")}
          disabled={pending !== null}
          className="h-11 rounded-sm bg-accent"
        >
          {pending === "yes" && <Spinner />}
          {t("yes")}
        </Button>
      </div>
    </div>
  );
}

// Step 2: rate the call and create a case
function RateStep({
  emergencyId,
  onCreateCase,
  onDone,
}: {
  emergencyId: number;
  onCreateCase: () => void;
  onDone: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rated, setRated] = useState(false);

  async function submitRating() {
    setSubmitting(true);
    const result = await rateEmergency(emergencyId, {
      stars,
      comment: comment.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message ?? t("failed"));
      return;
    }

    toast.success(result.message ?? t("rateSuccess"));
    setRated(true);
  }

  return (
    <div className="space-y-5">
      {rated ? (
        <p className="text-center text-sm text-primary/60">{t("thanks")}</p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary">{t("rateTitle")}</p>
          <Rating value={stars} onChange={setStars} />
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={t("commentPlaceholder")}
            maxLength={1000}
            className="border border-secondary"
          />
          <Button
            type="button"
            onClick={submitRating}
            disabled={stars === 0 || submitting}
            className="w-full h-11 rounded-sm bg-accent"
          >
            {submitting && <Spinner />}
            {t("submitRating")}
          </Button>
        </div>
      )}

      <div className="space-y-2 rounded-sm border border-secondary p-4">
        <p className="text-sm text-primary/60">{t("createCaseHint")}</p>
        <Button
          type="button"
          variant="outline"
          onClick={onCreateCase}
          className="w-full h-11 rounded-sm border-accent/40 text-accent hover:bg-accent/5 hover:text-accent"
        >
          <Briefcase className="size-4" aria-hidden="true" />
          {t("createCase")}
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onDone}
        className="w-full h-11 text-primary/50 text-xs"
      >
        {t("close")}
      </Button>
    </div>
  );
}

// Step 3: convert the emergency into a case. The client writes the title and
// description; the legal area, city and urgency come from the request.
function CreateCaseStep({
  emergency,
  onBack,
  onDone,
}: {
  emergency: Emergency;
  onBack: () => void;
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

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-11 rounded-sm border-secondary font-normal text-primary/60"
        >
          {tCase("back")}
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
