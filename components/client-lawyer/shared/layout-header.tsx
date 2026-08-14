"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { ChevronDown, LogOutIcon, Settings, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth";
import { deleteToken } from "@/lib/cookies";
import { useRouter } from "@/i18n/navigation";

export default function LayoutHeader() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const t = useTranslations("Client.Sidebar");

  return (
    <header className="h-14 z-20 flex items-center justify-end sticky top-0 bg-white px-4 border-b border-secondary/20">
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-sm hover:bg-secondary/10 h-10"
            >
              <Avatar size="sm">
                <AvatarImage src={user?.photo_url || ""} />
                <AvatarFallback>
                  {user?.first_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user?.first_name}</span>
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
                {user?.first_name} {user?.last_name}
              </p>
              <span className="text-primary/40 text-xs">{user?.email}</span>
            </div>

            <DropdownMenuSeparator className="bg-secondary/20" />

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
              variant="destructive"
              className="h-10 rounded-none cursor-pointer px-4"
              onClick={async () => {
                const result = await signOut();
                if (result.success) {
                  await deleteToken();
                  setUser(null);
                  router.push("/");
                }
              }}
            >
              <LogOutIcon />
              {t("Logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
