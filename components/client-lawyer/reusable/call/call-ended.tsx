"use client";

import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { PhoneOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CallEndResult, formatSeconds } from "./config";

export default function CallEnded({
  result,
  onDone,
  children,
}: {
  result: CallEndResult;
  onDone: () => void;
  children?: React.ReactNode;
}) {
  const t = useTranslations("Call.Ended");

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
          {t("callDuration", { name: result.remoteName })}:{" "}
          {formatSeconds(result.durationSeconds)}.
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 space-y-5">
        {children}

        <Button
          className="w-full font-normal rounded-xs h-11 border-primary/20 text-primary/60 bg-transparent"
          onClick={onDone}
          variant="outline"
        >
          {t("noThanks")}
        </Button>
      </div>
    </>
  );
}
