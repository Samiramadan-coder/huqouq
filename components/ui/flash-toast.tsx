"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const COOKIE_NAME = "flash_message";

// Shows a message left by a redirect (e.g. the API's 401 message after the
// session expired) as a toast, then clears it so it only shows once.
export function FlashToast() {
  useEffect(() => {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`),
    );
    if (!match) return;

    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    toast.error(decodeURIComponent(match[1]));
  }, []);

  return null;
}
