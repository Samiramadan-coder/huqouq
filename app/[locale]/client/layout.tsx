import {
  Sidebar,
  SidebarMenu,
  SidebarInset,
  SidebarGroup,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import PrimaryLogo from "@/components/icons/primary-logo";
import Header from "@/components/client-lawyer/shared/header";

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
        className="border-e border-secondary/30"
      >
        <SidebarContent className="bg-white">
          <SidebarGroup className="p-0">
            <Link href="/" className="w-full">
              <div className="px-4 h-14 border-b border-secondary/20 flex items-center">
                <PrimaryLogo />
                <span className="uppercase font-semibold font-lora ms-1">
                  huqouq
                </span>
              </div>
            </Link>
            <SidebarMenu>-</SidebarMenu>
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
