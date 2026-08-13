"use client";

import {
  ChevronDown,
  LayoutDashboardIcon,
  LogOutIcon,
  Settings,
  UserIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./language-switcher";
import { Link, useRouter } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth";
import { deleteToken } from "@/lib/cookies";
import { useUser } from "@/providers/user-provider";

export default function HeaderControl() {
  const router = useRouter();
  const t = useTranslations("Header");
  const { user, setUser } = useUser();

  return (
    <>
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

              <DropdownMenuItem
                onClick={() => router.push(`/${user.role}/dashboard`)}
                className="h-10 rounded-none cursor-pointer px-4 text-secondary hover:bg-secondary/10!"
              >
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

              <DropdownMenuItem
                className="h-10 rounded-none cursor-pointer px-4 text-[#9b2c2c]"
                onClick={async () => {
                  const result = await signOut();
                  if (result.success) {
                    await deleteToken();
                    setUser(null);
                    router.push("/");
                  }
                }}
              >
                <LogOutIcon className="text-[#9b2c2c]" />
                {t("Logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
