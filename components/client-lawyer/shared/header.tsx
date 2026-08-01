import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { ChevronDown, LogOutIcon, Settings, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Header() {
  const t = await getTranslations("Client.Sidebar");

  return (
    <header className="h-14 flex items-center justify-end sticky top-0 bg-white px-4 border-b border-secondary/20">
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-sm hover:bg-secondary/10 h-10"
            >
              <Avatar size="sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <span>Ahmad</span>
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
                Ahmed Al Rashidi
              </p>
              <span className="text-primary/40 text-xs">
                example@example.com
              </span>
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
