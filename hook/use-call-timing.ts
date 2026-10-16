"use client";

import { useEffect, useState } from "react";
import {
  CallSchedule,
  MOCK_SCHEDULE,
  getMockStartsAt,
  ENDING_SOON_MINUTES,
  DEFAULT_BUFFER_MINUTES,
  JOIN_OPENS_BEFORE_MINUTES,
} from "@/components/client-lawyer/reusable/call/config";

export type CallPhase =
  | "loading" // before mount, the clock isn't known yet
  | "tooEarly" // more than JOIN_OPENS_BEFORE_MINUTES before start
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
// endsAt = start + duration, hardEndAt = endsAt + buffer.
export function useCallTiming(schedule: CallSchedule): CallTiming {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const startsAt = MOCK_SCHEDULE
    ? getMockStartsAt()
    : new Date(schedule.startsAt).getTime();
  const { durationMinutes, bufferMinutes = DEFAULT_BUFFER_MINUTES } =
    MOCK_SCHEDULE ?? schedule;

  const opensAt = startsAt - JOIN_OPENS_BEFORE_MINUTES * MINUTE;
  const endsAt = startsAt + durationMinutes * MINUTE;
  const hardEndAt = endsAt + bufferMinutes * MINUTE;

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
      phase === "inProgress" && secondsToEnd <= ENDING_SOON_MINUTES * 60,
    secondsToStart: Math.ceil((startsAt - now) / 1000),
    secondsToEnd,
    secondsToHardEnd: Math.ceil((hardEndAt - now) / 1000),
  };
}
