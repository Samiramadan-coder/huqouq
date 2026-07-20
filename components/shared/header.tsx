import Logo from "../icons/logo";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./header/language-switcher";
import NavLink from "./header/nav-link";
import { getTranslations } from "next-intl/server";
import { navigationItems } from "@/constants/shared";
import MobileMenu from "./header/mobile-menu";

export default async function Header() {
  const t = await getTranslations("Header");
  const navItems = navigationItems(t);

  // const navigationItems = [
  //   {
  //     label: t("Navigation.Home"),
  //     href: "/",
  //   },
  //   {
  //     label: t("Navigation.HowItWorks"),
  //     href: "/how-it-works",
  //   },
  //   {
  //     label: t("Navigation.ForLawyers"),
  //     href: "/for-lawyers",
  //   },
  //   {
  //     label: t("Navigation.ForClients"),
  //     href: "/for-clients",
  //   },
  //   {
  //     label: t("Navigation.About"),
  //     href: "/about",
  //   },
  // ] as const;

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
          {navItems.map((item) => {
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

        <MobileMenu />
      </div>
    </header>
  );
}
