"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isArabic = locale === "ar";

  function changeLocale() {
    router.replace(pathname, {
      locale: isArabic ? "en" : "ar",
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={changeLocale}
      className="h-auto p-0 text-sm font-medium text-secondary hover:bg-transparent hover:text-secondary/80"
    >
      {isArabic ? "EN" : "AR"}
    </Button>
  );
}
