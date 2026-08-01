import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getLocale, getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { clientSidebarLinks } from "@/constants/layout";
import Header from "@/components/client-lawyer/shared/header";
import SidebarLogo from "@/components/client-lawyer/shared/layout/sidebar-logo";
import SidebarNavLink from "@/components/client-lawyer/shared/layout/sidebar-nav-link";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.Sidebar");

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        side={locale === "ar" ? "right" : "left"}
        collapsible="icon"
        className="border-e border-secondary/30"
      >
        <SidebarContent className="bg-white">
          <SidebarGroup className="p-0">
            <SidebarLogo />

            <SidebarMenu className="p-4">
              {clientSidebarLinks(t).map((link, index) => {
                if (link.type === "divider") {
                  return (
                    <Separator key={index} className="bg-secondary/20 my-2" />
                  );
                }

                return (
                  <SidebarNavLink
                    key={index}
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <main>
          <Header />
          <div className="min-h-screen p-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
