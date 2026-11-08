import { Bell, LucideIcon, Siren } from "lucide-react";
import { GuestType } from "@/types/shared";
import { Notification } from "@/types/notifications";

type ScreenConfig = {
  icon: LucideIcon;
  /** Icon color: gold for activity on requests/cases, neutral for account events */
  tone?: "accent" | "muted";
  /** Where the notification leads; omit for notifications with no page */
  href?: (role: GuestType, id: number) => string;
};

// Keyed by `target.screen` from the API. Add new screens here as the backend
// introduces them; unknown screens fall back to DEFAULT_CONFIG.
const SCREENS: Record<string, ScreenConfig> = {
  // No emergency details page yet, so it opens the emergency history
  client_emergency_request: {
    icon: Siren,
    tone: "accent",
    href: () => "/client/emergency-history",
  },
};

const DEFAULT_CONFIG: ScreenConfig = { icon: Bell };

export function getNotificationConfig(
  notification: Notification,
  role: GuestType,
) {
  const config =
    (notification.target && SCREENS[notification.target.screen]) ||
    DEFAULT_CONFIG;

  return {
    icon: config.icon,
    tone: config.tone ?? "muted",
    href:
      config.href && notification.target
        ? config.href(role, notification.target.id)
        : null,
  };
}
