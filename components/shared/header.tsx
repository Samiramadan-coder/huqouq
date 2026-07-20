import Logo from "../icons/logo";
import NavLink from "./header/nav-link";
import { Link } from "@/i18n/navigation";
import MobileMenu from "./header/mobile-menu";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/constants/shared";
import LanguageSwitcher from "./header/language-switcher";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export default async function Header() {
  const t = await getTranslations("Header");
  const locale = await getLocale();
  const navItems = navigationItems(t);

  return (
    <header className="bg-primary text-white">
      <div className="container max-w-7xl flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={t("LogoLabel")}
        >
          <Logo />

          <span
            className={cn(
              "text-xl font-semibold tracking-widest text-white leading-relaxed",
              locale === "en" && "font-lora",
            )}
          >
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
