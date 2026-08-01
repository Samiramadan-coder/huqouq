import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOutIcon, Settings, UserIcon } from "lucide-react";

export default function Header() {
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
                <AvatarFallback>CN</AvatarFallback>
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
            <div className="p-2">
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
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="h-10 rounded-none cursor-pointer px-4 text-primary hover:bg-secondary/10!">
              <Settings className="size-4 text-primary/40" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-secondary/20" />
            <DropdownMenuItem
              variant="destructive"
              className="h-10 rounded-none cursor-pointer px-4"
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
