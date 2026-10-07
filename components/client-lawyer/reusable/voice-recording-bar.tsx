"use client";

import { ArrowUp, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

// Replaces the message input while a voice message is being recorded
export default function VoiceRecordingBar({
  seconds,
  maxSeconds,
  sending,
  onCancel,
  onSend,
  labels,
}: {
  seconds: number;
  maxSeconds: number;
  sending: boolean;
  onCancel: () => void;
  onSend: () => void;
  labels: { recording: string; cancel: string; send: string };
}) {
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const limitReached = seconds >= maxSeconds;

  return (
    <div
      role="group"
      aria-label={labels.recording}
      className="flex h-12 items-center gap-3 rounded-xs border border-secondary bg-white px-3"
    >
      <span
        aria-hidden="true"
        className={[
          "size-2 shrink-0 rounded-full bg-destructive",
          limitReached ? "" : "animate-pulse motion-reduce:animate-none",
        ].join(" ")}
      />

      <span className="text-xs text-primary/70">{labels.recording}</span>

      <span className="text-xs font-medium text-primary tabular-nums" dir="ltr">
        {time}
      </span>

      <button
        type="button"
        aria-label={labels.cancel}
        disabled={sending}
        onClick={onCancel}
        className="ms-auto flex size-7 cursor-pointer items-center justify-center rounded-full text-primary/50 outline-none hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label={labels.send}
        disabled={sending}
        onClick={onSend}
        className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
      >
        {sending ? (
          <Spinner className="size-3.5" />
        ) : (
          <ArrowUp className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
