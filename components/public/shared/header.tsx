import { cn } from "@/lib/utils";
import Logo from "../../icons/logo";
import NavLink from "./header/nav-link";
import { Link } from "@/i18n/navigation";
import MobileMenu from "./header/mobile-menu";
import HeaderControl from "./header/header-control";
import { navigationItems } from "@/constants/shared";
import HeaderContainer from "./header/header-container";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("Header");

  return (
    <HeaderContainer>
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
          {navigationItems(t).map((item) => {
            return (
              <NavLink key={item.href} href={item.href} label={item.label} />
            );
          })}
        </nav>

        <HeaderControl />

        <MobileMenu />
      </div>
    </HeaderContainer>
  );
}
