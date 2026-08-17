"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";

export default function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm tracking-wide transition-colors duration-300 font-semibold pb-px text-white/70 hover:text-accent",
        isActive && "text-accent",
      )}
    >
      {label}

      {isActive && (
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent" />
      )}
    </Link>
  );
}
