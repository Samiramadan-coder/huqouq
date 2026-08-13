import Logo from "../../icons/logo";
import { cn } from "@/lib/utils";
import NavLink from "./header/nav-link";
import { Link } from "@/i18n/navigation";
import MobileMenu from "./header/mobile-menu";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/constants/shared";
import HeaderContainer from "./header/header-container";
import LanguageSwitcher from "./header/language-switcher";
import { getLocale, getTranslations } from "next-intl/server";
import { http } from "@/lib/http";
import { User } from "@/types/shared";
import { cookies } from "next/headers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  LayoutDashboardIcon,
  LogOutIcon,
  Settings,
  UserIcon,
} from "lucide-react";

export default async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("Header");
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let user: User | null = null;

  if (token) {
    const { data, ok } = await http.get<{ data: User }>("/api/auth/me");

    if (!ok) {
      throw new Error("Failed to fetch user data");
    }

    user = data.data;
  }

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

        {!user && (
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
        )}

        {user && (
          <div className="gap-3 hidden items-center lg:flex">
            <LanguageSwitcher />

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-sm h-10 hover:bg-transparent hover:text-white"
                >
                  <Avatar className="w-8 h-8 me-1">
                    <AvatarImage src={user.photo_url || ""} />
                    <AvatarFallback>
                      {user.first_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.first_name}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 rounded-xs shadow-none border-none! bg-white p-0"
                align="end"
                forceMount
              >
                <div className="px-4 py-2">
                  <p className="font-medium text-primary text-sm">
                    {user.first_name} {user.last_name}
                  </p>
                  <span className="text-primary/40 text-xs">{user.email}</span>
                </div>
                <DropdownMenuSeparator className="bg-secondary/20" />
                <DropdownMenuItem className="h-10 rounded-none cursor-pointer px-4 text-secondary hover:bg-secondary/10!">
                  <LayoutDashboardIcon className="size-4 text-secondary" />
                  {t("GoToDashboard")}
                </DropdownMenuItem>
                <DropdownMenuItem className="h-10 rounded-none cursor-pointer px-4 text-primary hover:bg-secondary/10!">
                  <UserIcon className="size-4 text-primary/40" />
                  {t("Profile")}
                </DropdownMenuItem>
                <DropdownMenuItem className="h-10 rounded-none cursor-pointer px-4 text-primary hover:bg-secondary/10!">
                  <Settings className="size-4 text-primary/40" />
                  {t("Settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-secondary/20" />
                <DropdownMenuItem className="h-10 rounded-none cursor-pointer px-4 text-[#9b2c2c]">
                  <LogOutIcon className="text-[#9b2c2c]" />
                  {t("Logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <MobileMenu />
      </div>
    </HeaderContainer>
  );
}
