import { Button } from "../../ui/button";
import { Link } from "@/i18n/navigation";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import { ShieldCheck, Scale, BookOpen, Clock3, MoveRight } from "lucide-react";

export default async function HowItWorks() {
  const t = await getTranslations("Home.HowItWorks");

  const features = [
    {
      icon: ShieldCheck,
      title: t("Features.Verified.Title"),
      text: t("Features.Verified.Text"),
    },
    {
      icon: Scale,
      title: t("Features.Specializations.Title"),
      text: t("Features.Specializations.Text"),
    },
    {
      icon: BookOpen,
      title: t("Features.Reviewed.Title"),
      text: t("Features.Reviewed.Text"),
    },
    {
      icon: Clock3,
      title: t("Features.Emergency.Title"),
      text: t("Features.Emergency.Text"),
    },
  ];

  const clientSteps = [1, 2, 3].map((step) => ({
    number: `0${step}`,
    title: t(`Clients.Steps.${step}.Title`),
    description: t(`Clients.Steps.${step}.Description`),
  }));

  const lawyerSteps = [1, 2, 3].map((step) => ({
    number: `0${step}`,
    title: t(`Lawyers.Steps.${step}.Title`),
    description: t(`Lawyers.Steps.${step}.Description`),
  }));

  return (
    <section className="text-primary">
      <div className="border-b border-border/30">
        <div className="container max-w-7xl grid grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  flex items-center justify-center gap-3 px-6 py-8 
                  ${
                    index !== features.length - 1
                      ? "lg:border-r lg:border-border/30"
                      : ""
                  }
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={1.5}
                  className="shrink-0 text-secondary"
                />

                <p className="text-sm text-primary/60">
                  <span className="font-lora font-semibold text-primary">
                    {feature.title}
                  </span>{" "}
                  {feature.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="container max-w-7xl py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16 text-center"
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-secondary">
            {t("Label")}
          </p>
          <h2 className="mt-4 font-lora text-4xl font-semibold text-primary md:text-[42px]">
            {t("Title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProcessCard
              title={t("Clients.Title")}
              steps={clientSteps}
              action={t("Clients.Action")}
              type="client"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProcessCard
              title={t("Lawyers.Title")}
              steps={lawyerSteps}
              action={t("Lawyers.Action")}
              type="lawyer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type Step = {
  number: string;
  title: string;
  description: string;
};

function ProcessCard({
  title,
  steps,
  action,
  type,
}: {
  title: string;
  steps: Step[];
  action: string;
  type: "client" | "lawyer";
}) {
  const isClient = type === "client";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      className={`flex h-full flex-col rounded-lg border p-10 ${
        isClient
          ? "border-primary/10 bg-primary/5"
          : "border-secondary/20 bg-secondary/5"
      }`}
    >
      <div className="mb-8 flex items-center gap-3">
        <span
          className={`h-6 w-0.75 rounded-full ${
            isClient ? "bg-secondary" : "bg-primary"
          }`}
        />

        <h3 className="font-lora text-[21px] font-semibold text-primary">
          {title}
        </h3>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-[36px_1fr] items-start gap-4"
          >
            <div
              className={`flex size-8 items-center justify-center rounded-full border text-xs ${
                isClient
                  ? "border-secondary text-secondary bg-secondary/10"
                  : "border-border text-primary bg-primary/10"
              }`}
            >
              {step.number}
            </div>

            <div>
              <h4 className="font-lora text-[17px] font-semibold text-primary">
                {step.title}
              </h4>

              <p className="mt-1 max-w-115 text-[14px] leading-6 text-primary/55">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className={`mt-8 border-t pt-8 ${
          isClient ? "border-primary/10" : "border-secondary/20"
        }`}
      >
        <Link href={isClient ? "/sign-up/client" : "/sign-up/lawyer"}>
          <Button
            variant="ghost"
            className={`hover:bg-transparent hover:text-secondary group inline-flex items-center gap-2 text-sm font-medium ${
              isClient ? "text-secondary" : "text-primary"
            }`}
          >
            {action}
            <MoveRight
              size={14}
              className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
