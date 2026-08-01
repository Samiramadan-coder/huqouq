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

export const clientSidebarLinks: SidebarLink[] = [
  {
    href: "/client/dashboard",
    label: "Overview",
    icon: createElement(LayoutGrid, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/cases",
    label: "Cases",
    icon: createElement(FolderOpen, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/legal-services",
    label: "Legal Services",
    icon: createElement(Scale, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/find-lawyers",
    label: "Find Lawyers",
    icon: createElement(Search, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/my-consultations",
    label: "My Consultations",
    icon: createElement(CalendarCheck, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/favorites",
    label: "Favorites",
    icon: createElement(Heart, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/messages",
    label: "Messages",
    icon: createElement(MessageSquare, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/notifications",
    label: "Notifications",
    icon: createElement(Bell, { className: "size-4" }),
    type: "link",
  },
  {
    type: "divider",
  },
  {
    href: "/client/emergency-history",
    label: "Emergency History",
    icon: createElement(ShieldAlert, { className: "size-4" }),
    type: "link",
  },
  {
    type: "divider",
  },
  {
    href: "/client/profile",
    label: "Profile",
    icon: createElement(CircleUserRound, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/client/settings",
    label: "Settings",
    icon: createElement(Settings, { className: "size-4" }),
    type: "link",
  },
];
