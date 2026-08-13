import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { CircleHelp, Mail, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CTA() {
  const locale = await getLocale();
  const t = await getTranslations("About.cta");

  return (
    <section>
      {/* CTA */}
      <div className="bg-primary px-6 py-20 sm:px-10 lg:py-27.5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-250 text-center"
        >
          <h2
            className={cn(
              "text-4xl md:text-5xl font-bold mb-8 leading-tight text-white",
              { "font-lora": locale === "en" },
            )}
          >
            {t("title")}
          </h2>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up/client"
              className="flex h-13.5 min-w-47 items-center justify-center rounded-[6px] bg-secondary px-7 text-[15px] font-semibold text-primary transition-opacity hover:opacity-90"
            >
              {t("clientButton")}
            </Link>

            <Link
              href="/sign-up/lawyer"
              className="flex h-13.5 min-w-41.5 items-center justify-center rounded-[6px] border-2 border-secondary px-7 text-[15px] font-semibold text-secondary transition-colors hover:bg-secondary hover:text-primary"
            >
              {t("lawyerButton")}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Contact */}
      <div className="bg-[#F7F4EE] px-6 py-12 sm:px-10 lg:py-12.5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-200"
        >
          <p
            className={cn(
              "text-center text-[13px] tracking-[0.12em] text-primary/60 uppercase",
              { "font-lora": locale === "en" },
            )}
          >
            {t("contact.title")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-6 text-[14px] text-primary/80 md:flex-row md:gap-12">
            <a
              href="mailto:hello@huqouq.ae"
              className="flex items-center gap-3 transition-colors hover:text-primary"
            >
              <Mail
                className="size-4.5 shrink-0 text-secondary"
                strokeWidth={1.5}
              />
              <span dir="ltr">{t("contact.email")}</span>
            </a>

            <a
              href="tel:+971012345678"
              className="flex items-center gap-3 transition-colors hover:text-primary"
            >
              <Phone
                className="size-4.5 shrink-0 text-secondary"
                strokeWidth={1.5}
              />
              <span dir="ltr">{t("contact.phone")}</span>
            </a>

            <Link
              href="/contact"
              className="flex items-center gap-3 transition-colors hover:text-primary"
            >
              <CircleHelp
                className="size-4.5 shrink-0 text-secondary"
                strokeWidth={1.5}
              />
              <span>{t("contact.inquiry")}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
