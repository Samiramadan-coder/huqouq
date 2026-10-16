"use client";

import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Clock, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallEndResult, formatSeconds } from "./config";

export default function CallEnded({
  result,
  onDone,
  children,
}: {
  result: CallEndResult;
  onDone: () => void;
  // Slot for a rating / feedback section, rendered between the summary and the action.
  children?: React.ReactNode;
}) {
  const t = useTranslations("Call.Ended");

  return (
    <>
      <DialogHeader className="p-6 border-b border-secondary items-center text-center">
        <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <PhoneOff className="size-5" aria-hidden="true" />
        </span>
        <DialogTitle className="ltr:font-lora text-base font-semibold text-primary">
          {t("title")}
        </DialogTitle>
        <DialogDescription className="text-sm text-primary/55">
          {result.reason === "timeEnded" ? t("timeEnded") : t("left")}
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between rounded-sm border border-secondary px-4 py-3">
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary/40">
            <Clock className="size-3.5" aria-hidden="true" />
            {t("timeSpent")}
          </span>
          <span className="text-sm font-semibold tabular-nums text-primary">
            {formatSeconds(result.durationSeconds)}
          </span>
        </div>

        {children}

        <Button
          className="w-full bg-accent font-normal rounded-sm"
          onClick={onDone}
        >
          {t("done")}
        </Button>
      </div>
    </>
  );
}
