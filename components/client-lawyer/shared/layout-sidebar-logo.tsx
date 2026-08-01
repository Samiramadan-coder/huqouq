import { Link } from "@/i18n/navigation";
import PrimaryLogo from "@/components/icons/primary-logo";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export default async function SidebarLogo() {
  const t = await getTranslations("Header");
  const locale = await getLocale();

  return (
    <Link href="/" className="w-full">
      <div className="px-4 h-14 border-b border-secondary/20 flex items-center">
        <PrimaryLogo />
        <span
          className={cn("uppercase font-semibold ms-1", {
            "font-lora": locale === "en",
          })}
        >
          {t("Title")}
        </span>
      </div>
    </Link>
  );
}
