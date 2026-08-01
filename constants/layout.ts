import {
  Bell,
  Scale,
  Heart,
  Search,
  Percent,
  Settings,
  LayoutGrid,
  FolderOpen,
  ShieldAlert,
  NotebookPen,
  MessageSquare,
  CalendarCheck,
  CircleUserRound,
  CircleDollarSign,
  NotepadTextDashed,
} from "lucide-react";
import { T } from "@/types/shared";
import { createElement } from "react";

type SidebarLink =
  | {
      href: string;
      label: string;
      icon: React.ReactNode;
      type: "link";
      count?: number;
    }
  | {
      type: "divider";
    };

// Sidebar links for the client layout
// This function takes a translation function `t` as an argument and returns an array of sidebar links for the client layout.
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
    count: 5,
  },
  {
    href: "/client/notifications",
    label: t("Notifications"),
    icon: createElement(Bell, { className: "size-4" }),
    type: "link",
    count: 3,
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

// Sidebar links for the lawyer layout
// This function takes a translation function `t` as an argument and returns an array of sidebar links for the lawyer layout.
export const lawyerSidebarLinks = (t: T): SidebarLink[] => [
  {
    href: "/lawyer/dashboard",
    label: t("Overview"),
    icon: createElement(LayoutGrid, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/my-offers",
    label: t("MyOffers"),
    icon: createElement(Percent, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/cases",
    label: t("Cases"),
    icon: createElement(FolderOpen, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/consultations",
    label: t("Consultations"),
    icon: createElement(CalendarCheck, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/my-earnings",
    label: t("MyEarnings"),
    icon: createElement(CircleDollarSign, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/messages",
    label: t("Messages"),
    icon: createElement(MessageSquare, { className: "size-4" }),
    type: "link",
  },
  {
    type: "divider",
  },
  {
    href: "/lawyer/services",
    label: t("Services"),
    icon: createElement(Scale, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/service-offers",
    label: t("ServiceOffers"),
    icon: createElement(NotepadTextDashed, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/active-services",
    label: t("ActiveServices"),
    icon: createElement(NotebookPen, { className: "size-4" }),
    type: "link",
  },
  {
    type: "divider",
  },
  {
    href: "/lawyer/profile",
    label: t("Profile"),
    icon: createElement(CircleUserRound, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/settings",
    label: t("Settings"),
    icon: createElement(Settings, { className: "size-4" }),
    type: "link",
  },
  {
    href: "/lawyer/emergency-history",
    label: t("EmergencyHistory"),
    icon: createElement(ShieldAlert, { className: "size-4" }),
    type: "link",
  },
];
