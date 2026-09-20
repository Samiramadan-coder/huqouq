import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Privacy");
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
              {t("informationWeCollect.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("informationWeCollect.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("howWeUseYourInformation.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("howWeUseYourInformation.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("dataSharingAndThirdParties.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("dataSharingAndThirdParties.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("yourRights.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("yourRights.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("dataSecurity.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("dataSecurity.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("contactForPrivacyConcerns.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("contactForPrivacyConcerns.content")}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-primary mb-3">
              {t("policyUpdates.title")}
            </h2>
            <p className="font-serif text-base leading-[1.8] text-primary/70">
              {t("policyUpdates.content")}
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
