import Logo from "../../icons/logo";
import { Link } from "@/i18n/navigation";
import AppStoreIcon from "../../icons/app-store";
import FooterLink from "./footer/footer-link";
import PlayStoreIcon from "../../icons/play-store";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import FooterColumn, { FooterHeading } from "./footer/footer-column";
import { lawyerLinks, legalLinks, platformLinks } from "@/constants/shared";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-primary text-white">
      <div className="container max-w-7xl py-14 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr] lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label={t("LogoLabel")}
            >
              <Logo />

              <span className="font-lora text-xl font-semibold tracking-[0.18em]">
                HUQUOQ
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-6 text-white/70">
              {t("Description")}
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
              {t("AvailableAcross")}
            </p>

            <div className="mt-5 flex flex-col items-start gap-3">
              <Link
                href="#"
                className="flex gap-2 h-12 w-36 items-center rounded-md bg-black px-3 text-white transition-opacity hover:opacity-85"
              >
                <AppStoreIcon />

                <span className="flex flex-col leading-none">
                  <span className="text-[8px] uppercase">
                    {t("AppStore.Download")}
                  </span>
                  <span className="mt-0.5 text-sm font-medium">
                    {t("AppStore.Name")}
                  </span>
                </span>
              </Link>

              <Link
                href="#"
                className="flex gap-2 h-12 w-36 items-center rounded-md bg-black px-3 text-white transition-opacity hover:opacity-85"
              >
                <PlayStoreIcon />

                <span className="flex flex-col leading-none">
                  <span className="text-[8px] uppercase">
                    {t("GooglePlay.Download")}
                  </span>
                  <span className="mt-0.5 text-sm font-medium">
                    {t("GooglePlay.Name")}
                  </span>
                </span>
              </Link>
            </div>

            <div className="mt-12">
              <FooterHeading>{t("Sections.Support")}</FooterHeading>

              <FooterLink href="/contact">{t("Links.ContactUs")}</FooterLink>
            </div>
          </div>

          <FooterColumn title={t("Sections.Platform")}>
            {platformLinks(t).map((item) => (
              <FooterLink key={item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("Sections.ForLawyers")}>
            {lawyerLinks(t).map((item) => (
              <FooterLink key={item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("Sections.Legal")}>
            {legalLinks(t).map((item) => (
              <FooterLink key={item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <Separator className="my-12 bg-white/10" />

        <div className="flex flex-col gap-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("Copyright", { year: new Date().getFullYear() })}</p>

          <p>{t("TrustStatement")}</p>
        </div>
      </div>
    </footer>
  );
}
