"use client";

import { useCallback, useEffect, useState } from "react";
import { usePublicSettings } from "@/providers/public-settings.provider";

// Seconds left before a verification code can be resent, using the admin
// "resend cooldown" setting. Starts counting when the code is first sent
// (on mount) and again on every `restart()`.
export function useResendCooldown(startOnMount = true) {
  const { security } = usePublicSettings();
  const cooldown = security.otp_resend_cooldown_seconds;
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const restart = useCallback(
    () => setEndsAt(Date.now() + cooldown * 1000),
    [cooldown],
  );

  useEffect(() => {
    // Deferred so the clock is only read in the browser.
    if (startOnMount) queueMicrotask(restart);
  }, [startOnMount, restart]);

  useEffect(() => {
    if (endsAt === null) return;

    const update = () =>
      setSecondsLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return { secondsLeft, restart };
}
