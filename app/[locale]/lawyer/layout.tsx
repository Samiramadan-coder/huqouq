import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { http } from "@/lib/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { lawyerSidebarLinks } from "@/constants/layout";
import { getNotifications } from "@/lib/shared/notifications";
import { getLocale, getTranslations } from "next-intl/server";
import { EmergencyLive } from "@/types/lawyer/emergency-membership";
import LayoutHeader from "@/components/client-lawyer/shared/layout-header";
import LayoutSidebarLogo from "@/components/client-lawyer/shared/layout-sidebar-logo";
import LayoutSidebarNavLink from "@/components/client-lawyer/shared/layout-sidebar-nav-link";
import EmergencyNotification from "@/components/client-lawyer/lawyer/global/emergency-notification";
import { NotificationsProvider } from "@/components/client-lawyer/shared/notifications/notifications-provider";

export default async function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const cookiesStore = await cookies();
  const t = await getTranslations("Lawyer.Sidebar");
  const token = cookiesStore.get("token")?.value;

  if (!token) {
    return redirect("/sign-in");
  }

  const [{ data }, notifications] = await Promise.all([
    http.get<{ data: EmergencyLive }>("/api/lawyer/emergency/availability"),
    getNotifications(),
  ]);

  return (
    <NotificationsProvider role="lawyer" initialData={notifications}>
      <EmergencyNotification isLive={data.data.is_live} />

      <SidebarProvider defaultOpen>
        <Sidebar
          side={locale === "ar" ? "right" : "left"}
          collapsible="icon"
          className="border-e border-secondary"
        >
          <SidebarContent className="bg-white">
            <SidebarGroup className="p-0">
              <LayoutSidebarLogo />

              <SidebarMenu className="p-4">
                {lawyerSidebarLinks(t).map((link, index) => {
                  if (link.type === "divider") {
                    return (
                      <Separator key={index} className="bg-accent/20 my-2" />
                    );
                  }

                  return (
                    <LayoutSidebarNavLink
                      key={index}
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      count={link.count}
                      liveCount={link.liveCount}
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 min-w-0 min-h-screen">
          <LayoutHeader owner="lawyer" emergencyLive={data.data} />

          <div className="min-w-0 w-full overflow-x-clip">
            <div className="min-w-0 w-full">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </NotificationsProvider>
  );
}
