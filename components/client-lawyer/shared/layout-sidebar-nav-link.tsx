"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useFormatters } from "@/lib/format";
import { useNotifications } from "./notifications/notifications-provider";

export default function SidebarNavLink({
  href,
  label,
  icon,
  count,
  liveCount,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  liveCount?: "notifications";
}) {
  const format = useFormatters();
  const { unreadCount } = useNotifications();
  const value = liveCount === "notifications" ? unreadCount : count;
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const isActive = normalizedPathname.startsWith(href);

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="mb-1 h-11! rounded-none hover:bg-accent/10! text-primary/50 data-[active=true]:border-s-2 data-[active=true]:border-accent data-[active=true]:bg-accent/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
    >
      <Link href={href} className="flex items-center gap-2 ">
        {icon}
        <span>{label}</span>
        {!!value && value > 0 && (
          <div className="ms-auto text-xs font-semibold text-white bg-accent min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
            {value > 99 ? `${format.number(99)}+` : format.number(value)}
          </div>
        )}
      </Link>
    </SidebarMenuButton>
  );
}
