import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Terms");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="bg-white">
      <div className="container max-w-3xl py-20">
        <h1
          className={`text-4xl md:text-5xl font-semibold text-primary mb-3 text-balance ${fontClass}`}
        >
          {t("title")}
        </h1>

        <p className="text-sm text-primary/50 tracking-widest uppercase font-sans mb-12">
          {t("lastUpdated")}
        </p>

        <p
          className={`text-lg leading-relaxed text-primary/80 mb-12 ${fontClass}`}
        >
          {t("introduction")}
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("acceptanceOfTerms.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("acceptanceOfTerms.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("userResponsibilities.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("userResponsibilities.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("lawyerVerificationDisclaimer.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("lawyerVerificationDisclaimer.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("limitationOfLiability.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("limitationOfLiability.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("intellectualProperty.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("intellectualProperty.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("modificationsToTerms.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("modificationsToTerms.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("governingLaw.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("governingLaw.content")}
            </p>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-secondary">
          <p className="font-sans text-sm text-primary/50">
            {t("contact.title")}{" "}
            <Link href="/contact" className="text-accent hover:underline">
              {t("contact.getInTouch")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
