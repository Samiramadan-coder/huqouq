"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLink from "./nav-link";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { Button } from "@/components/ui/button";
import { Menu, MoveRight, ShieldCheck } from "lucide-react";
import { useUser } from "@/providers/user-provider";
import { navigationItems } from "@/constants/shared";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth";
import { deleteToken } from "@/lib/cookies";
import LanguageSwitcher from "./language-switcher";
import { useState } from "react";

export default function MobileMenu() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("Header");
  const navItems = navigationItems(t);
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        className="border-none bg-primary text-white"
        onClick={() => setOpen(false)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <SheetHeader className="text-start">
            <SheetTitle className="flex items-center gap-3 text-white">
              <ShieldCheck className="size-7 text-accent" />
              <span className="font-serif tracking-[0.15em]">{t("Title")}</span>
            </SheetTitle>

            <SheetDescription className="sr-only">
              {t("MenuDescription")}
            </SheetDescription>
          </SheetHeader>
        </div>

        <nav className="flex flex-col gap-6 px-4">
          {navItems.map((item) => {
            return (
              <NavLink href={item.href} label={item.label} key={item.href} />
            );
          })}
        </nav>

        <div className="px-4">
          <LanguageSwitcher />
        </div>

        <Separator className="bg-accent/10" />

        <div className="p-4">
          {user ? (
            <div className="flex flex-col gap-4">
              <div
                className="flex items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photo_url || ""} />
                  <AvatarFallback className="bg-white text-primary">
                    {user?.first_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      locale === "en" && "font-lora",
                    )}
                  >
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-xs text-white/45 mt-0.5">{user?.email}</p>
                </div>
              </div>

              <Link
                href={`/${user.role}/dashboard`}
                className="text-accent text-sm font-semibold flex items-center gap-2"
              >
                {t("GoToDashboard")}
                <MoveRight className="size-4 rtl:rotate-180" />
              </Link>

              <Link href="/" className="text-sm font-semibold text-white/65">
                {t("Profile")}
              </Link>

              <Link href="/" className="text-sm font-semibold text-white/65">
                {t("Settings")}
              </Link>

              <p
                className="text-[#9b2c2c] font-semibold cursor-pointer"
                onClick={async () => {
                  const result = await signOut();
                  if (result.success) {
                    await deleteToken();
                    setUser(null);
                    router.push("/");
                  }
                  setOpen(false);
                }}
              >
                {t("Logout")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-white/65 transition-colors hover:text-white"
              >
                {t("SignIn")}
              </Link>

              <Link href="/get-started">
                <Button
                  variant="outline"
                  className="bg-transparent rounded-xs h-9.5 w-full border-accent text-accent hover:bg-accent hover:text-primary"
                >
                  {t("GetStarted")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
