import { T } from "@/types/shared";

export const navigationItems = (t: T) => [
  {
    label: t("Navigation.Home"),
    href: "/",
  },
  {
    label: t("Navigation.HowItWorks"),
    href: "/how-it-works",
  },
  {
    label: t("Navigation.ForLawyers"),
    href: "/for-lawyers",
  },
  {
    label: t("Navigation.ForClients"),
    href: "/for-clients",
  },
  {
    label: t("Navigation.About"),
    href: "/about",
  },
];

export const platformLinks = (t: T) => [
  {
    label: t("Links.HowItWorks"),
    href: "/how-it-works",
  },
  {
    label: t("Links.Specializations"),
    href: "/specializations",
  },
  {
    label: t("Links.FindLawyer"),
    href: "/lawyers",
  },
  {
    label: t("Links.EmergencyHelp"),
    href: "/emergency-help",
  },
  {
    label: t("Links.PostCase"),
    href: "/post-case",
  },
];

export const lawyerLinks = (t: T) => [
  {
    label: t("Links.JoinAsLawyer"),
    href: "/join-as-lawyer",
  },
  {
    label: t("Links.ForLawyers"),
    href: "/for-lawyers",
  },
];

export const legalLinks = (t: T) => [
  {
    label: t("Links.PrivacyPolicy"),
    href: "/privacy-policy",
  },
  {
    label: t("Links.TermsOfService"),
    href: "/terms-of-service",
  },
  {
    label: t("Links.CookiePolicy"),
    href: "/cookie-policy",
  },
  {
    label: t("Links.Disclaimer"),
    href: "/disclaimer",
  },
];
