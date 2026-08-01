import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { lawyerSidebarLinks } from "@/constants/layout";
import { getLocale, getTranslations } from "next-intl/server";
import LayoutHeader from "@/components/client-lawyer/shared/layout-header";
import LayoutSidebarLogo from "@/components/client-lawyer/shared/layout-sidebar-logo";
import LayoutSidebarNavLink from "@/components/client-lawyer/shared/layout-sidebar-nav-link";

export default async function LawyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Lawyer.Sidebar");

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        side={locale === "ar" ? "right" : "left"}
        collapsible="icon"
        className="border-e border-secondary/30"
      >
        <SidebarContent className="bg-white">
          <SidebarGroup className="p-0">
            <LayoutSidebarLogo />

            <SidebarMenu className="p-4">
              {lawyerSidebarLinks(t).map((link, index) => {
                if (link.type === "divider") {
                  return (
                    <Separator key={index} className="bg-secondary/20 my-2" />
                  );
                }

                return (
                  <LayoutSidebarNavLink
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
          <LayoutHeader />
          <div className="min-h-screen p-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
