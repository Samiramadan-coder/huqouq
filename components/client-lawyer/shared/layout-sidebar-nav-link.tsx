"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export default function SidebarNavLink({
  href,
  label,
  icon,
  count,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}) {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const isActive = normalizedPathname.startsWith(href);

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="mb-1 h-11! rounded-none hover:bg-secondary/10! text-primary/50 data-[active=true]:border-s-2 data-[active=true]:border-secondary data-[active=true]:bg-secondary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
    >
      <Link href={href} className="flex items-center gap-2 ">
        {icon}
        <span>{label}</span>
        {count && (
          <div className="ml-auto text-xs font-semibold text-white bg-secondary w-5 h-5 rounded-full flex items-center justify-center">
            {count}
          </div>
        )}
      </Link>
    </SidebarMenuButton>
  );
}
