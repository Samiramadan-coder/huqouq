"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hook/use-push-notifications";

export default function PushNotificationsControl() {
  const t = useTranslations("Client.Settings.Account");
  const { status, pending, enable, disable } = usePushNotifications();

  const hint =
    status === "unsupported"
      ? t("notificationsUnsupported")
      : status === "denied"
        ? t("notificationsDenied")
        : t("notificationsHint");

  const onCheckedChange = async (checked: boolean) => {
    try {
      if (!checked) {
        await disable();
        toast.success(t("notificationsDisabled"));
        return;
      }

      const next = await enable();

      if (next === "enabled") toast.success(t("notificationsEnabled"));
      else if (next === "denied") toast.error(t("notificationsDenied"));
    } catch (error) {
      console.error("Error changing push notifications", error);
      toast.error(t("notificationsError"));
    }
  };

  return (
    <div className="py-4 flex items-center justify-between gap-4">
      <div>
        <span className="text-sm text-primary">{t("notifications")}</span>
        <p className="text-[11px] text-primary/40 mt-0.5 leading-snug">
          {hint}
        </p>
      </div>

      <Switch
        aria-label={t("notifications")}
        checked={status === "enabled"}
        disabled={
          pending ||
          status === "loading" ||
          status === "unsupported" ||
          status === "denied"
        }
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
