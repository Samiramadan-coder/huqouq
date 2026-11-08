"use client";

import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useState } from "react";
import { PhoneOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatters } from "@/lib/format";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { recordEmergencyOutcome } from "@/lib/lawyer/emergency-requests";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  CallEndResult,
  formatSeconds,
} from "@/components/client-lawyer/reusable/call/config";

// TODO: replace with the outcome list from the backend; only "advice_given"
// is confirmed so far
const OUTCOMES = ["advice_given"] as const;

// The lawyer's dialog after an emergency call: record the outcome and a
// private note (replaces the default CallEnded)
export default function EmergencyOutcome({
  emergencyId,
  result,
  onDone,
}: {
  emergencyId: number;
  result: CallEndResult;
  onDone: () => void;
}) {
  const t = useTranslations("Lawyer.EmergencyOutcome");
  const format = useFormatters();
  const [outcome, setOutcome] = useState<string>("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    const response = await recordEmergencyOutcome(emergencyId, {
      outcome,
      note: note.trim() || undefined,
    });

    setSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? t("failed"));
      return;
    }

    toast.success(response.message ?? t("success"));
    onDone();
  }

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
          {t("callDuration", { name: result.remoteName })}{" "}
          {format.digits(formatSeconds(result.durationSeconds))}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {result.reason === "remoteNoShow" && (
          <p
            role="status"
            className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700"
          >
            {t("clientNoShow")}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="outcome" className="text-sm text-primary">
            {t("outcomeLabel")}
          </Label>
          <Select value={outcome} onValueChange={setOutcome}>
            <SelectTrigger
              id="outcome"
              className="w-full h-11! rounded-sm border border-secondary"
            >
              <SelectValue placeholder={t("outcomePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {OUTCOMES.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`Outcomes.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outcome-note" className="text-sm text-primary">
            {t("noteLabel")}
          </Label>
          <Textarea
            id="outcome-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("notePlaceholder")}
            maxLength={1000}
            className="border border-secondary"
          />
          <p className="text-xs text-primary/40">{t("noteHint")}</p>
        </div>

        <div className="space-y-2">
          <Button
            type="submit"
            disabled={!outcome || submitting}
            className="w-full h-11 rounded-sm bg-accent"
          >
            {submitting && <Spinner />}
            {t("submit")}
          </Button>

          {/* The outcome can still be recorded later (can.record_outcome) */}
          <Button
            type="button"
            variant="ghost"
            onClick={onDone}
            disabled={submitting}
            className="w-full h-11 text-primary/50 text-xs"
          >
            {t("later")}
          </Button>
        </div>
      </form>
    </>
  );
}
