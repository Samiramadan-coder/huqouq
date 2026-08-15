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

export const listOfYears = Array.from({ length: 60 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: year.toString(), value: year };
});

export const listOfMonths = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
