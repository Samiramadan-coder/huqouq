import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../icons/logo";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./header/language-switcher";
import NavLink from "./header/nav-link";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations("Header");

  const navigationItems = [
    {
      label: t("Navigation.Home"),
      href: "/",
    },
    {
      label: t("Navigation.HowItWorks"),
      href: "/how-it-works",
    },
    {
      label: t("Navigation.ForLawyers"),
      href: "/for-lawyers",
    },
    {
      label: t("Navigation.ForClients"),
      href: "/for-clients",
    },
    {
      label: t("Navigation.About"),
      href: "/about",
    },
  ] as const;

  return (
    <header className="bg-primary text-white">
      <div className="container max-w-7xl flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={t("LogoLabel")}
        >
          <Logo />

          <span className="font-serif text-xl font-semibold tracking-widest text-white leading-relaxed">
            {t("Title")}
          </span>
        </Link>

        <nav
          aria-label={t("NavigationLabel")}
          className="hidden items-center gap-9 lg:flex"
        >
          {navigationItems.map((item) => {
            return (
              <NavLink key={item.href} href={item.href} label={item.label} />
            );
          })}
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <LanguageSwitcher />

          <Link
            href="/sign-in"
            className="text-sm font-semibold text-white/65 transition-colors hover:text-white"
          >
            {t("SignIn")}
          </Link>

          <Link href="/get-started">
            <Button
              variant="outline"
              className="bg-transparent rounded-xs h-9.5 w-30.25 border-secondary text-secondary hover:bg-secondary hover:text-primary"
            >
              {t("GetStarted")}
            </Button>
          </Link>
        </div>

        {/* <Sheet>
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
        </Sheet> */}
      </div>
    </header>
  );
}
