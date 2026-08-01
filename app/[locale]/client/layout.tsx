import Header from "@/components/client-lawyer/shared/header";
import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getLocale } from "next-intl/server";

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
          <SidebarGroup>
            <SidebarMenu className="p-2">-</SidebarMenu>
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
