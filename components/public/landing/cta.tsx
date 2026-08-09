import Link from "next/link";
import { Button } from "../../ui/button";
import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

export default async function CTA() {
  const t = await getTranslations("Home.CTA");

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="container max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-7 flex items-center justify-center gap-4"
        >
          <span className="h-px w-16 bg-secondary/40" />
          <ShieldCheck size={20} strokeWidth={1.3} className="text-secondary" />
          <span className="h-px w-16 bg-secondary/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.45,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-secondary"
        >
          {t("Label")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-lora text-4xl font-semibold text-primary md:text-5xl"
        >
          {t("Title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.55,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground"
        >
          {t("Description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.55,
            delay: 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="h-12 min-w-46 rounded-sm bg-secondary px-8 text-primary hover:bg-secondary/90"
          >
            <Link href="/sign-up/client">{t("Actions.Client")}</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 min-w-40 rounded-sm border-primary/20 bg-transparent px-8 text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/sign-up/lawyer">{t("Actions.Lawyer")}</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            delay: 0.38,
          }}
          className="mt-8 flex flex-wrap items-center justify-center text-xs tracking-wide text-muted-foreground/50"
        >
          <span>{t("Footer.Subscription")}</span>
          <span className="mx-2">·</span>
          <span>{t("Footer.Verified")}</span>
          <span className="mx-2">·</span>
          <span>{t("Footer.Secure")}</span>
        </motion.div>
      </div>
    </section>
  );
}
