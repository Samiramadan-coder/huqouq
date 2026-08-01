import {
  LayoutGrid,
  FolderOpen,
  Scale,
  Search,
  CalendarCheck,
  Heart,
  MessageSquare,
  Bell,
  ShieldAlert,
  CircleUserRound,
  Settings,
} from "lucide-react";
import { T } from "@/types/shared";
import { createElement } from "react";

type SidebarLink =
  | {
      href: string;
      label: string;
      icon: React.ReactNode;
      type: "link";
    }
  | {
      type: "divider";
    };

export const clientSidebarLinks = (t: T): SidebarLink[] => [
  {
    href: "/client/dashboard",
    label: t("Overview"),
    icon: createElement(LayoutGrid, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/cases",
    label: t("Cases"),
    icon: createElement(FolderOpen, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/legal-services",
    label: t("LegalServices"),
    icon: createElement(Scale, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/find-lawyers",
    label: t("FindLawyer"),
    icon: createElement(Search, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/my-consultations",
    label: t("MyConsultations"),
    icon: createElement(CalendarCheck, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/favorites",
    label: t("Favorites"),
    icon: createElement(Heart, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/messages",
    label: t("Messages"),
    icon: createElement(MessageSquare, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/notifications",
    label: t("Notifications"),
    icon: createElement(Bell, { className: "size-4" }),
    type: "link",
  },
  {
    type: "divider",
  },
  {
    href: "/client/emergency-history",
    label: t("EmergencyHistory"),
    icon: createElement(ShieldAlert, { className: "size-4" }),
    type: "link",
  },
  {
    type: "divider",
  },
  {
    href: "/client/profile",
    label: t("Profile"),
    icon: createElement(CircleUserRound, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/settings",
    label: t("Settings"),
    icon: createElement(Settings, { className: "size-4" }),
    type: "link",
  },
];
