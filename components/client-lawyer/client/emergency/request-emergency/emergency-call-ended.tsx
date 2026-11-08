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
import { Briefcase, PhoneOff } from "lucide-react";
import Rating from "@/components/client-lawyer/reusable/rating";
import { continueEmergency, rateEmergency } from "@/lib/client/emergency";
import {
  CallEndResult,
  formatSeconds,
} from "@/components/client-lawyer/reusable/call/config";

// The client's dialog after an emergency call, in two steps:
// 1. continue with this lawyer or not  2. (if continuing) rate + create a case
export default function EmergencyCallEnded({
  emergencyId,
  result,
  onDone,
}: {
  emergencyId: number;
  result: CallEndResult;
  onDone: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const format = useFormatters();
  const [step, setStep] = useState<"continue" | "rate">("continue");

  return (
    <>
      <DialogHeader className="p-6 border-b border-secondary items-center text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <PhoneOff className="size-5" aria-hidden="true" />
        </span>

        <DialogTitle className="ltr:font-lora text-xl font-bold text-primary">
          {t("title")}
        </DialogTitle>

        <DialogDescription className="text-sm text-primary/55">
          {t("callDuration")}{" "}
          {format.digits(formatSeconds(result.durationSeconds))}
        </DialogDescription>
      </DialogHeader>

      <div className="p-6">
        {step === "continue" ? (
          <ContinueStep
            emergencyId={emergencyId}
            onContinue={() => setStep("rate")}
            onDone={onDone}
          />
        ) : (
          <RateStep emergencyId={emergencyId} onDone={onDone} />
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
  onDone,
}: {
  emergencyId: number;
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
        {/* TODO: wire up case creation */}
        <Button
          type="button"
          variant="outline"
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
