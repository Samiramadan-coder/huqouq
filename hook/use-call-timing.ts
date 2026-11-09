"use client";

import { useEffect, useState } from "react";
import {
  CallSchedule,
  ENDING_SOON_MINUTES,
} from "@/components/client-lawyer/reusable/call/config";
import { usePublicSettings } from "@/providers/public-settings.provider";

export type CallPhase =
  | "loading" // before mount, the clock isn't known yet
  | "tooEarly" // before join opens (admin "join opens" setting)
  | "lobby" // join is open, scheduled start not reached
  | "inProgress" // between start and endsAt
  | "extraTime" // between endsAt and hardEndAt
  | "ended"; // past hardEndAt

export type CallTiming = {
  phase: CallPhase;
  canJoin: boolean;
  isEndingSoon: boolean;
  secondsToStart: number;
  secondsToEnd: number;
  secondsToHardEnd: number;
};

const MINUTE = 60_000;

// Times are based on the scheduled start, not when anyone joins:
// endsAt = start + duration, hardEndAt = endsAt + buffer. When the API gives
// the time the call closes (schedule.closesAt), that is the hard end instead.
export function useCallTiming(schedule: CallSchedule): CallTiming {
  const { consultations } = usePublicSettings();
  const [localNow, setLocalNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setLocalNow(Date.now());

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // The server's "now" when the schedule says how far off the browser clock is
  const now =
    localNow === null ? null : localNow - (schedule.clockOffsetMs ?? 0);
  const endingSoonMinutes = schedule.endingSoonMinutes ?? ENDING_SOON_MINUTES;

  if (now === null) {
    return {
      phase: "loading",
      canJoin: false,
      isEndingSoon: false,
      secondsToStart: 0,
      secondsToEnd: 0,
      secondsToHardEnd: 0,
    };
  }

  const startsAt = new Date(schedule.startsAt).getTime();
  const {
    durationMinutes,
    bufferMinutes = consultations.consultations_call_grace_minutes,
  } = schedule;

  const opensAt = schedule.joinOpensAt
    ? new Date(schedule.joinOpensAt).getTime()
    : startsAt - consultations.consultations_join_early_minutes * MINUTE;
  const scheduledEndAt = startsAt + durationMinutes * MINUTE;
  const hardEndAt = schedule.closesAt
    ? new Date(schedule.closesAt).getTime()
    : scheduledEndAt + bufferMinutes * MINUTE;
  // Never count down past the moment the call closes.
  const endsAt = Math.min(scheduledEndAt, hardEndAt);

  const phase: CallPhase =
    now < opensAt
      ? "tooEarly"
      : now < startsAt
        ? "lobby"
        : now < endsAt
          ? "inProgress"
          : now < hardEndAt
            ? "extraTime"
            : "ended";

  const secondsToEnd = Math.ceil((endsAt - now) / 1000);

  return {
    phase,
    canJoin: now >= opensAt && now < hardEndAt,
    isEndingSoon:
      phase === "inProgress" && secondsToEnd <= endingSoonMinutes * 60,
    secondsToStart: Math.ceil((startsAt - now) / 1000),
    secondsToEnd,
    secondsToHardEnd: Math.ceil((hardEndAt - now) / 1000),
  };
}
