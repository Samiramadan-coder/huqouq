import { cn } from "@/lib/utils";
import {
  Shield,
  Users,
  BriefcaseBusiness,
  House,
  FileText,
  Monitor,
  Layers,
  DollarSign,
  Phone,
  Globe,
  Landmark,
  LifeBuoy,
} from "lucide-react";
import * as motion from "motion/react-client";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Expertise() {
  const t = await getTranslations("Home.Expertise");
  const locale = await getLocale();

  const areas = [
    {
      icon: Shield,
      label: t("Areas.Criminal"),
    },
    {
      icon: Users,
      label: t("Areas.Family"),
    },
    {
      icon: BriefcaseBusiness,
      label: t("Areas.Commercial"),
    },
    {
      icon: House,
      label: t("Areas.RealEstate"),
    },
    {
      icon: FileText,
      label: t("Areas.Civil"),
    },
    {
      icon: Monitor,
      label: t("Areas.Labor"),
    },
    {
      icon: Layers,
      label: t("Areas.Constitutional"),
    },
    {
      icon: DollarSign,
      label: t("Areas.Financial"),
    },
    {
      icon: Phone,
      label: t("Areas.Maritime"),
    },
    {
      icon: Globe,
      label: t("Areas.PrivateInternational"),
    },
    {
      icon: Landmark,
      label: t("Areas.Public"),
    },
    {
      icon: LifeBuoy,
      label: t("Areas.Administrative"),
    },
  ];

  return (
    <section className="border-b border-border/30 bg-white py-24 lg:py-28">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-14 text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-secondary">
            {t("Label")}
          </p>

          <h2
            className={cn(
              "font-lora text-3xl font-semibold text-primary md:text-4xl",
              { "font-lora": locale === "en" },
            )}
          >
            {t("Title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {areas.map(({ icon: Icon, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.45,
                delay: (index % 6) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                group flex min-h-25 cursor-pointer
                flex-col items-center justify-center gap-3
                rounded-sm border border-border/55
                bg-background px-4 py-6
                transition-colors
                relative
                hover:border-secondary
                hover:bg-white
                hover:bottom-1
              "
            >
              <Icon
                size={25}
                strokeWidth={1.2}
                className="
                  text-foreground/55
                  transition-colors
                  group-hover:text-secondary
                "
              />

              <p
                className={cn("text-center text-xs text-primary/65", {
                  "font-lora": locale === "en",
                })}
              >
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
