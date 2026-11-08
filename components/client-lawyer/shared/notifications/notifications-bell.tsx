"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFormatters } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./notifications-provider";
import NotificationItem, { useOpenNotification } from "./notification-item";

const BELL_LIMIT = 10;

export default function NotificationsBell() {
  const t = useTranslations("Notifications");
  const { number } = useFormatters();
  const openNotification = useOpenNotification();
  const { role, notifications, unreadCount, markAllAsRead } =
    useNotifications();

  const latest = notifications.slice(0, BELL_LIMIT);
  const badge = unreadCount > 9 ? `${number(9)}+` : number(unreadCount);

  const handleMarkAll = async () => {
    const success = await markAllAsRead();
    if (!success) toast.error(t("MarkAllError"));
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("Title")}
          className="relative rounded-sm hover:bg-accent/10 size-10"
        >
          <Bell className="size-5 text-primary" />
          {unreadCount > 0 && (
            <span className="absolute top-1 inset-e-1 min-w-4 h-4 px-1 rounded-full bg-destructive text-white text-[10px] leading-4 font-medium text-center">
              {badge}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 rounded-xs shadow-none border-none! bg-white p-0"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <p className="font-semibold text-primary text-sm">{t("Title")}</p>
          {unreadCount > 0 && (
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={handleMarkAll}
            >
              {t("MarkAllAsRead")}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="bg-accent/20 m-0" />

        {latest.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-primary/40">
            {t("Empty")}
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {latest.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={() => openNotification(notification)}
                className={cn(
                  "rounded-none cursor-pointer px-4 py-3 hover:bg-accent/10! focus:bg-accent/10!",
                  !notification.read_at && "bg-accent/5",
                )}
              >
                <NotificationItem
                  notification={notification}
                  variant="compact"
                />
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator className="bg-accent/20 m-0" />

        <DropdownMenuItem
          asChild
          className="justify-center h-10 rounded-none cursor-pointer text-sm text-primary hover:bg-accent/10!"
        >
          <Link href={`/${role}/notifications`}>{t("ViewAll")}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
