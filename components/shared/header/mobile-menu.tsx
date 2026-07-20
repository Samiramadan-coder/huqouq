import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLink from "./nav-link";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck } from "lucide-react";
import { navigationItems } from "@/constants/shared";
import { getLocale, getTranslations } from "next-intl/server";

export default async function MobileMenu() {
  const t = await getTranslations("Header");
  const locale = await getLocale();
  const isArabic = locale === "ar";

  const navItems = navigationItems(t);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-label={t("OpenMenu")}
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side={isArabic ? "left" : "right"}
        className="border-none bg-[#1e4162] text-white"
      >
        <SheetHeader className="text-start">
          <SheetTitle className="flex items-center gap-3 text-white">
            <ShieldCheck className="size-7 text-[#d2ad3f]" />
            <span className="font-serif tracking-[0.15em]">{t("Title")}</span>
          </SheetTitle>

          <SheetDescription className="sr-only">
            {t("MenuDescription")}
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-6 px-4">
          {navItems.map((item) => {
            return (
              <SheetClose asChild key={item.href}>
                <NavLink href={item.href} label={item.label} key={item.href} />
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
