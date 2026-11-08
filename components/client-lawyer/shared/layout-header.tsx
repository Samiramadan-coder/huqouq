"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { signOut } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { deleteToken } from "@/lib/cookies";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { signOutOfFirebase } from "@/features/chat";
import { unregisterPushNotifications } from "@/features/push-notifications";
import { useUser } from "@/providers/user-provider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EmergencyLive } from "@/types/lawyer/emergency-membership";
import { ChevronDown, LogOutIcon, Settings, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RequestEmergencyHelp from "../client/emergency/request-emergency/request-emergency-help";
import SosControl from "../lawyer/emergency-membership/sos-header-control/sos-control";

type Props =
  | {
      owner: "client";
    }
  | {
      owner: "lawyer";
      emergencyLive: EmergencyLive;
    };

export default function LayoutHeader(props: Props) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const t = useTranslations("Client.Sidebar");

  return (
    <header className="h-14 z-20 flex items-center justify-between sticky top-0 bg-white px-4 border-b border-accent/20">
      <div>
        <SidebarTrigger className="lg:hidden" />
      </div>

      <div className="flex items-center gap-3">
        {props.owner === "client" && <RequestEmergencyHelp />}

        {props.owner === "lawyer" && (
          <SosControl emergencyLive={props.emergencyLive} />
        )}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-sm hover:bg-accent/10 h-10"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.photo_url || ""} />
                <AvatarFallback className="text-xs bg-white text-primary">
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

            <DropdownMenuSeparator className="bg-accent/20" />

            <DropdownMenuItem
              onClick={() => router.push(`/${user?.role}/profile`)}
              className="h-10 rounded-none cursor-pointer px-4 text-primary hover:bg-accent/10!"
            >
              <UserIcon className="size-4 text-primary/40" />
              {t("Profile")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(`/${user?.role}/settings`)}
              className="h-10 rounded-none cursor-pointer px-4 text-primary hover:bg-accent/10!"
            >
              <Settings className="size-4 text-primary/40" />
              {t("Settings")}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-accent/20" />

            <DropdownMenuItem
              variant="destructive"
              className="h-10 rounded-none cursor-pointer px-4"
              onClick={async () => {
                // Before signOut: unregistering the device needs the auth cookie
                await unregisterPushNotifications();
                const result = await signOut();
                if (result.success) {
                  await deleteToken();
                  await signOutOfFirebase();
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
