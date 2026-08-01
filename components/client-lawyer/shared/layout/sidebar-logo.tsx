import { Link } from "@/i18n/navigation";
import PrimaryLogo from "@/components/icons/primary-logo";

export default function SidebarLogo() {
  return (
    <Link href="/" className="w-full">
      <div className="px-4 h-14 border-b border-secondary/20 flex items-center">
        <PrimaryLogo />
        <span className="uppercase font-semibold font-lora ms-1">huqouq</span>
      </div>
    </Link>
  );
}
