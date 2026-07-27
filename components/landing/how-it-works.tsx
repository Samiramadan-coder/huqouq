import { getTranslations } from "next-intl/server";
import { ShieldCheck, Scale, BookOpen, Clock3, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

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
              <div
                key={feature.text}
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

                <p className="text-sm text-foreground/55">
                  <span className="font-lora font-semibold text-primary">
                    {feature.title}
                  </span>{" "}
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container max-w-7xl py-24 lg:py-28">
        <div className="mb-16 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-secondary">
            {t("Label")}
          </p>
          <h2 className="mt-4 font-lora text-4xl font-semibold text-primary md:text-[42px]">
            {t("Title")}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProcessCard
            title={t("Clients.Title")}
            steps={clientSteps}
            action={t("Clients.Action")}
            type="client"
          />

          <ProcessCard
            title={t("Lawyers.Title")}
            steps={lawyerSteps}
            action={t("Lawyers.Action")}
            type="lawyer"
          />
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
    <div
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
        {steps.map((step) => (
          <div
            key={step.number}
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

              <p className="mt-1 max-w-115 text-[14px] leading-6 text-foreground/55">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`mt-8 border-t pt-8 ${
          isClient ? "border-primary/10" : "border-secondary/20"
        }`}
      >
        <Button
          variant="link"
          className={`group inline-flex items-center gap-2 text-sm font-medium ${
            isClient ? "text-secondary" : "text-primary"
          }`}
        >
          {action}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          />
        </Button>
      </div>
    </div>
  );
}
