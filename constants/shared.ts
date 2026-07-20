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
