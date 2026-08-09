import {
  Check,
  Search,
  BarChart3,
  CreditCard,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import * as motion from "motion/react-client";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

type Step = {
  key: "choose" | "offers" | "payment" | "complete";
  number: string;
  icon: LucideIcon;
  side: "start" | "end";
};

const steps: Step[] = [
  {
    key: "choose",
    number: "01",
    icon: Search,
    side: "start",
  },
  {
    key: "offers",
    number: "02",
    icon: BarChart3,
    side: "end",
  },
  {
    key: "payment",
    number: "03",
    icon: CreditCard,
    side: "start",
  },
  {
    key: "complete",
    number: "04",
    icon: Check,
    side: "end",
  },
];

const serviceTypes = [
  "contractReview",
  "contractDrafting",
  "legalNotice",
  "legalMemos",
  "companyFormation",
  "companyAmendment",
  "trademarkRegistration",
  "otherLegalWork",
] as const;

export default async function LegalServices() {
  const locale = await getLocale();
  const t = await getTranslations("ForClients.legalServices");

  return (
    <section className="py-20 lg:py-27.5">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "text-3xl md:text-4xl font-semibold text-primary leading-tight my-5 text-balance",
              { "font-lora": locale === "en" },
            )}
          >
            {t("title")}
          </h2>

          <p className="text-base text-primary/55 leading-relaxed max-w-xl mx-auto text-pretty">
            {t("description")}
          </p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="relative mx-auto mt-16 hidden max-w-180 md:block">
          <div className="absolute inset-y-0 inset-s-1/2 w-px -translate-x-1/2 bg-secondary rtl:translate-x-1/2" />

          <div className="space-y-3">
            {steps.map(({ key, number, icon: Icon, side }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="relative grid min-h-47.5 grid-cols-[1fr_120px_1fr] items-center"
              >
                {/* Center marker */}
                <div className="absolute inset-s-1/2 top-1/2 z-10 size-1.75 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary bg-[#F7F4EE] rtl:translate-x-1/2" />

                {side === "start" ? (
                  <>
                    <StepContent
                      number={number}
                      title={t(`${key}.title`)}
                      description={t(`${key}.description`)}
                      align="end"
                    />

                    <div />

                    <StepIcon Icon={Icon} />
                  </>
                ) : (
                  <>
                    <StepIcon Icon={Icon} />

                    <div />

                    <StepContent
                      number={number}
                      title={t(`${key}.title`)}
                      description={t(`${key}.description`)}
                      align="start"
                    />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="relative mt-14 space-y-8 md:hidden">
          <div className="absolute bottom-0 inset-s-4.75 top-0 w-px bg-secondary/20" />

          {steps.map(({ key, number, icon: Icon }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: "easeOut",
              }}
              className="relative flex gap-6"
            >
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-[#F7F4EE] font-serif text-[13px] text-secondary">
                {number}
              </div>

              <div className="pb-5">
                <div className="flex size-11 items-center justify-center border border-secondary/20 bg-white">
                  <Icon className="size-5 text-[#C99B3F]" strokeWidth={1.4} />
                </div>

                <h3 className="mt-5 font-serif text-[20px] text-primary">
                  {t(`${key}.title`)}
                </h3>

                <p className="mt-2 max-w-90 text-[13px] leading-[1.7] text-primary/55">
                  {t(`${key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-xs text-primary/35">
            {t("availableServices")}
          </span>

          <div className="mx-auto mt-5 flex max-w-5xl flex-wrap justify-center gap-2">
            {serviceTypes.map((service) => (
              <span
                key={service}
                className="border border-secondary/20 bg-white px-4 py-2 text-sm text-primary/65"
              >
                {t(`services.${service}`)}
              </span>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-10 inline-flex h-12.5 items-center justify-center gap-3 rounded-[3px] bg-secondary px-8 text-sm font-semibold text-primary"
          >
            {t("button")}

            <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function StepIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="mx-auto flex size-24 items-center justify-center border border-secondary/20 bg-white">
      <Icon className="size-7 text-secondary" strokeWidth={1.35} />
    </div>
  );
}

function StepContent({
  number,
  title,
  description,
  align,
}: {
  number: string;
  title: string;
  description: string;
  align: "start" | "end";
}) {
  return (
    <div
      className={
        align === "end"
          ? "justify-self-end text-end"
          : "justify-self-start text-start"
      }
    >
      <span className="font-serif text-6xl font-semibold leading-none text-secondary/20">
        {number}
      </span>

      <h3 className="mt-2 font-serif text-2xl md:text-3xl font-medium text-primary">
        {title}
      </h3>

      <p className="mt-2 text-base leading-[1.65] text-primary/55">
        {description}
      </p>
    </div>
  );
}
