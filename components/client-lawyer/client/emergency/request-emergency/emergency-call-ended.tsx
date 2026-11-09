"use client";

import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Emergency } from "@/types/client/emergency";
import Rating from "@/components/client-lawyer/reusable/rating";
import EmergencyCaseFormStep from "../emergency-case-form";
import { BOOK_CONSULTATION_HREF } from "./emergency-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BadgeCheck,
  Hourglass,
  PhoneOff,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  getEmergency,
  rateEmergency,
  continueEmergency,
} from "@/lib/client/emergency";
import {
  CallEndResult,
  formatSeconds,
} from "@/components/client-lawyer/reusable/call/config";

// Where the client posts a regular case
const POST_CASE_HREF = "/client/my-cases/create";

type Step = "timeUp" | "rate" | "continue" | "working" | "case" | "thanks";

// The client's dialog after an emergency call:
// (time's up) -> rate -> continue with this lawyer?
//   yes -> "You're now working with Adv. {name}" -> set up the case
//   no  -> thank you, with other ways to get help
export default function EmergencyCallEnded({
  emergency: initialEmergency,
  result,
  onDone,
}: {
  emergency: Emergency;
  result: CallEndResult;
  onDone: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const format = useFormatters();
  // Re-fetched after "yes": the API then reveals the lawyer's name and photo
  const [emergency, setEmergency] = useState(initialEmergency);
  const [step, setStep] = useState<Step>(
    result.reason === "timeEnded" ? "timeUp" : "rate",
  );

  const duration = format.digits(formatSeconds(result.durationSeconds));

  const title =
    step === "timeUp"
      ? t("timeEndedTitle")
      : result.reason === "connectionLost"
        ? t("connectionLostTitle")
        : t("title");

  async function onContinued() {
    const latest = await getEmergency(emergency.id);
    if (latest) setEmergency(latest);
    setStep("working");
  }

  return (
    <>
      <DialogHeader className="p-6 border-b border-secondary items-center text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          {step === "timeUp" ? (
            <Hourglass className="size-5" aria-hidden="true" />
          ) : (
            <PhoneOff className="size-5" aria-hidden="true" />
          )}
        </span>

        <DialogTitle className="ltr:font-lora text-xl font-bold text-primary">
          {title}{" "}
          <span className="font-mono text-base font-normal text-primary/50">
            ({duration})
          </span>
        </DialogTitle>

        <DialogDescription className="sr-only">
          {t("callDuration")} {duration}
        </DialogDescription>
      </DialogHeader>

      <div className="p-6">
        {step === "timeUp" && (
          <Button
            type="button"
            onClick={() => setStep("rate")}
            className="h-11 w-full rounded-sm"
          >
            {t("next")}
          </Button>
        )}

        {step === "rate" && (
          <RateStep
            emergencyId={emergency.id}
            onNext={() => setStep("continue")}
          />
        )}

        {step === "continue" && (
          <ContinueStep
            emergencyId={emergency.id}
            onYes={onContinued}
            onNo={() => setStep("thanks")}
          />
        )}

        {step === "working" && (
          <WorkingWithStep
            emergency={emergency}
            onSetUpCase={() => setStep("case")}
            onLater={onDone}
          />
        )}

        {step === "case" && (
          <EmergencyCaseFormStep emergency={emergency} onDone={onDone} />
        )}

        {step === "thanks" && <ThanksStep onDone={onDone} />}
      </div>
    </>
  );
}

// Step 1: rate the call (5 stars + optional comment)
function RateStep({
  emergencyId,
  onNext,
}: {
  emergencyId: number;
  onNext: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    onNext();
  }

  return (
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
      <Button
        type="button"
        variant="ghost"
        onClick={onNext}
        disabled={submitting}
        className="w-full h-9 text-xs text-primary/50"
      >
        {t("skip")}
      </Button>
    </div>
  );
}

// Step 2: continue with this lawyer (as a case) or not
function ContinueStep({
  emergencyId,
  onYes,
  onNo,
}: {
  emergencyId: number;
  onYes: () => Promise<void>;
  onNo: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const [pending, setPending] = useState<"yes" | "no" | null>(null);

  async function answer(value: "yes" | "no") {
    setPending(value);
    const result = await continueEmergency(emergencyId, value);

    if (!result.success) {
      setPending(null);
      toast.error(result.message ?? t("failed"));
      return;
    }

    if (value === "yes") await onYes();
    else onNo();
    setPending(null);
  }

  return (
    <div className="space-y-4 rounded-sm border border-secondary p-5 text-center">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-primary">
          {t("continueQuestion")}
        </p>
        <p className="text-xs text-primary/50">{t("nameRevealedHint")}</p>
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          onClick={() => answer("yes")}
          disabled={pending !== null}
          className="h-11 w-full rounded-sm bg-accent"
        >
          {pending === "yes" && <Spinner />}
          {t("yes")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => answer("no")}
          disabled={pending !== null}
          className="h-11 w-full rounded-sm border-secondary font-normal text-primary/60"
        >
          {pending === "no" && <Spinner />}
          {t("no")}
        </Button>
      </div>
    </div>
  );
}

// Step 3 (yes): the lawyer is revealed
function WorkingWithStep({
  emergency,
  onSetUpCase,
  onLater,
}: {
  emergency: Emergency;
  onSetUpCase: () => void;
  onLater: () => void;
}) {
  const t = useTranslations("Client.Emergency.CallEnded");
  const lawyer = emergency.matched_lawyer;
  const name = lawyer?.name;

  return (
    <div className="space-y-5 text-center">
      <Avatar className="mx-auto size-20 bg-primary">
        {lawyer?.photo_url && (
          <AvatarImage src={lawyer.photo_url} alt={name ?? ""} />
        )}
        <AvatarFallback className="bg-primary text-2xl text-accent">
          {name ? (
            name[0]
          ) : (
            <ShieldCheck className="size-8" aria-hidden="true" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-base font-semibold text-primary">
          <UserCheck className="size-4 text-accent" aria-hidden="true" />
          {name ? t("workingWith", { name }) : t("workingWithLawyer")}
        </p>
        <p className="text-sm text-primary/55">
          {lawyer?.legal_area || emergency.legal_area.name}
        </p>
        {lawyer?.verified && (
          <p className="flex items-center justify-center gap-1 text-xs font-medium text-green-700">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            {t("verifiedLawyer")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          onClick={onSetUpCase}
          className="h-11 w-full rounded-sm bg-accent"
        >
          {t("setUpCase")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onLater}
          className="h-9 w-full text-xs text-primary/50"
        >
          {t("Case.maybeLater")}
        </Button>
      </div>
    </div>
  );
}

// Step 3 (no): thanks, with other ways to get help
function ThanksStep({ onDone }: { onDone: () => void }) {
  const t = useTranslations("Client.Emergency.CallEnded");

  return (
    <div className="space-y-5 text-center">
      <div className="space-y-1">
        <p className="text-base font-semibold text-primary">
          {t("thanksTitle")}
        </p>
        <p className="text-sm text-primary/55">{t("thanksDescription")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-11 rounded-sm">
          <Link href={POST_CASE_HREF} onClick={onDone}>
            {t("postCase")}
          </Link>
        </Button>
        <Button asChild className="h-11 rounded-sm bg-accent">
          <Link href={BOOK_CONSULTATION_HREF} onClick={onDone}>
            {t("bookConsultation")}
          </Link>
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onDone}
        className="h-9 w-full text-xs text-primary/50"
      >
        {t("close")}
      </Button>
    </div>
  );
}
