import Image from "next/image";
import * as motion from "motion/react-client";
import { Button } from "../../ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-primary overflow-hidden">
      <div
        className="absolute right-0 top-1/2 -translate-y-[calc(50%+60px)] w-175 h-175 opacity-[0.04] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 4L8 40v60c0 57 37 108 92 116 55-8 92-59 92-116V40L100 4z"
            fill="white"
          ></path>
          <path
            d="M65 112l22 22 48-44"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>

      <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,white_40px,white_41px)]" />

      <div className="container relative grid max-w-7xl items-center gap-16 py-40 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-secondary"
          >
            {t("Eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 text-balance font-lora text-4xl font-semibold leading-[1.15] text-white md:text-5xl lg:text-[3.25rem]"
          >
            {t("Title.Line1")}
            <br />
            {t("Title.Line2")}
            <br />
            <span className="text-secondary">{t("Title.Highlight")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-10 max-w-lg font-sans text-base leading-relaxed text-white/60"
          >
            {t("Description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/sign-up/client">
              <Button
                size="lg"
                className="
                  h-12 min-w-44 rounded-sm
                  bg-secondary text-primary
                  hover:bg-secondary
                "
              >
                {t("Actions.Client")}
              </Button>
            </Link>

            <Link href="/sign-up/lawyer">
              <Button
                variant="outline"
                size="lg"
                className="
                  h-12 min-w-40 rounded-sm
                  border-white/40 bg-transparent
                  text-white hover:border-secondary hover:bg-transparent hover:text-secondary
                "
              >
                {t("Actions.Lawyer")}
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 text-xs tracking-wide text-white/35"
          >
            {t("Stats.Lawyers")}
            <span className="mx-2">·</span>
            {t("Stats.Specializations")}
            <span className="mx-2">·</span>
            {t("Stats.Location")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 45, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto w-full"
        >
          <div className="rounded-xl border border-secondary/40 p-2">
            <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-secondary/20">
              <Image
                src="/landing-hero.png"
                alt={t("ImageAlt")}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
