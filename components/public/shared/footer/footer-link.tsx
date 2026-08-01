import { Link } from "@/i18n/navigation";

export default function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-white/60 transition-colors hover:text-secondary"
    >
      {children}
    </Link>
  );
}
