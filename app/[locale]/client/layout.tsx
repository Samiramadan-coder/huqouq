import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getLocale } from "next-intl/server";
import PrimaryLogo from "@/components/icons/primary-logo";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        side={locale === "ar" ? "right" : "left"}
        collapsible="icon"
        className="border-e border-secondary/30 bg-white"
      >
        <SidebarContent>
          <SidebarGroup className="p-0">
            <div className="px-4 h-14 border-b border-secondary/20 flex items-center">
              <PrimaryLogo />
              <span className="uppercase font-semibold font-lora ms-1">
                huqouq
              </span>
            </div>
            <SidebarMenu>-</SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <main>
          <header className="h-14 flex items-center justify-end sticky top-0 bg-white px-4 border-b border-secondary/20">
            -
          </header>
          <div className="min-h-screen p-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
