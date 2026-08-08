import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

const questions = [
  "verification",
  "privacy",
  "cost",
  "emergency",
  "cancel",
] as const;

export default async function FAQ() {
  const locale = await getLocale();
  const t = await getTranslations("HowItWorks.faq");

  return (
    <section className="py-20 lg:py-27.5 bg-[#EDE9E1]">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
            {t("eyebrow")}
          </span>

          <h2
            className={cn(
              "mt-5 text-3xl font-semibold leading-tight text-primary text-balance md:text-4xl",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("title")}
          </h2>
        </div>

        {/* Questions */}
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-14 max-w-3xl border-t border-primary/15"
        >
          {questions.map((key) => (
            <AccordionItem key={key} value={key} className="border-primary/15">
              <AccordionTrigger
                className={cn(
                  "cursor-pointer py-6 text-start text-lg font-medium text-primary hover:no-underline [&>svg]:text-secondary",
                  {
                    "font-lora": locale === "en",
                  },
                )}
              >
                {t(`${key}.question`)}
              </AccordionTrigger>

              <AccordionContent className="max-w-2xl pb-6 text-sm leading-[1.75] text-primary/55">
                {t(`${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
