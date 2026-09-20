import AppStoreIcon from "@/components/icons/app-store";
import PlayStoreIcon from "@/components/icons/play-store";
import Form from "@/components/public/contact/form";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Contact");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="bg-white">
      <div className="container max-w-6xl py-20">
        <div className="text-center mb-16">
          <h1
            className={`text-4xl md:text-5xl font-semibold text-primary mb-3 text-balance ${fontClass}`}
          >
            {t("title")}
          </h1>
          <p
            className={`text-lg text-primary/60 max-w-2xl mx-auto ${fontClass}`}
          >
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <Form />

          <div className="flex flex-col gap-8">
            <div className="p-8 rounded-sm border border-secondary bg-background">
              <div className="mb-8 pb-8 border-b border-secondary">
                <div className="flex items-start gap-3 mb-2">
                  <Mail className="size-4.5 text-accent" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-primary/60 tracking-widest uppercase mb-1">
                      {t("email")}
                    </p>
                    <a
                      href="mailto:support@huqouq.ae"
                      className="font-serif text-lg text-primary hover:text-accent transition-colors duration-300"
                    >
                      support@huqouq.ae
                    </a>
                  </div>
                </div>
              </div>
              <div className="mb-8 pb-8 border-b border-secondary">
                <div className="flex items-start gap-3 mb-2">
                  <Phone className="size-4.5 text-accent" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-primary/60 tracking-widest uppercase mb-1">
                      {t("phone")}
                    </p>
                    <a
                      href="tel:+97143210000"
                      className="font-serif text-lg text-primary hover:text-accent transition-colors duration-300"
                    >
                      +971 4 321 0000
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-4.5 text-accent" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-primary/60 tracking-widest uppercase mb-1">
                      {t("office")}
                    </p>
                    <p className="font-serif text-base leading-relaxed text-primary">
                      {t("address")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="font-sans text-xs font-semibold text-primary/50 tracking-widest uppercase">
                {t("downloadOurApp")}
              </p>
              <a
                href="#"
                aria-label="Download on the App Store"
                className="inline-flex items-center gap-2 bg-black border border-white/10 rounded-lg px-3 py-2 hover:border-accent/40 transition-all duration-300 w-fit"
              >
                <AppStoreIcon />
                <div className="flex flex-col leading-none">
                  <span className="font-sans text-[8px] tracking-wider text-white/40 uppercase">
                    {t("downloadOnThe")}
                  </span>
                  <span className="font-sans text-[12px] font-semibold text-white/80 tracking-tight">
                    {t("appStore")}
                  </span>
                </div>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="inline-flex items-center gap-2 bg-black border border-white/10 rounded-lg px-3 py-2 hover:border-accent/40 transition-all duration-300 w-fit"
              >
                <PlayStoreIcon />
                <div className="flex flex-col leading-none">
                  <span className="font-sans text-[8px] tracking-wider text-white/40 uppercase">
                    {t("getItOn")}
                  </span>
                  <span className="font-sans text-[12px] font-semibold text-white/80 tracking-tight">
                    {t("googlePlay")}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
