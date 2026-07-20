import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck } from "lucide-react";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-label={t("openMenu")}
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
            <span className="font-serif tracking-[0.15em]">HUQUOQ</span>
          </SheetTitle>

          <SheetDescription className="sr-only">
            {t("menuDescription")}
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-2 px-4">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <SheetClose asChild key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-4 py-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                    isActive && "bg-white/10 text-[#d2ad3f]",
                  )}
                >
                  {t(`navigation.${item.key}`)}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 p-4">
          <Button
            type="button"
            variant="ghost"
            onClick={changeLocale}
            className="w-full justify-start text-[#d2ad3f] hover:bg-white/10 hover:text-[#d2ad3f]"
          >
            {isArabic ? "English" : "العربية"}
          </Button>

          <SheetClose asChild>
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-white/10 hover:text-white",
              })}
            >
              {t("signIn")}
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/get-started"
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full border-[#d2ad3f] bg-transparent text-[#d2ad3f] hover:bg-[#d2ad3f] hover:text-[#1e4162]",
              })}
            >
              {t("getStarted")}
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
