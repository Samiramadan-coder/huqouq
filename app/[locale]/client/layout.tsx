import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { clientSidebarLinks } from "@/constants/layout";
import { getLocale, getTranslations } from "next-intl/server";
import LayoutHeader from "@/components/client-lawyer/shared/layout-header";
import LayoutSidebarLogo from "@/components/client-lawyer/shared/layout-sidebar-logo";
import LayoutSidebarNavLink from "@/components/client-lawyer/shared/layout-sidebar-nav-link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.Sidebar");
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  if (!token) {
    return redirect("/sign-in");
  }

  return (
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
              {clientSidebarLinks(t).map((link, index) => {
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
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex-1 min-w-0 min-h-screen">
        <LayoutHeader />
        <main className="min-w-0 w-full overflow-x-hidden p-4 sm:p-8">
          <div className="min-w-0 w-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
