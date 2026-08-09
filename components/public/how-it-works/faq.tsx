import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

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
    <section className="overflow-hidden py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <motion.span
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="text-sm font-medium text-secondary"
          >
            {t("eyebrow")}
          </motion.span>

          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: "easeOut",
            }}
            className={cn(
              "mt-5 text-balance text-3xl font-semibold leading-tight text-primary md:text-4xl",
              {
                "font-lora": locale === "en",
              },
            )}
          >
            {t("title")}
          </motion.h2>
        </motion.div>

        {/* Questions */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <Accordion
            type="single"
            collapsible
            className="border-t border-primary/15"
          >
            {questions.map((key, index) => (
              <motion.div
                key={key}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
              >
                <AccordionItem
                  value={key}
                  className="border-b border-primary/15"
                >
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

                  <AccordionContent className="max-w-2xl pb-6 text-base leading-[1.75] text-primary/55">
                    {t(`${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
