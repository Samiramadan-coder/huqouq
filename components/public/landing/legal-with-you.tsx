import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import AppStoreIcon from "@/components/icons/app-store";
import PlayStoreIcon from "@/components/icons/play-store";

export async function LegalWithYou() {
  const t = await getTranslations("Home.LegalWithYou");
  const tFooter = await getTranslations("Footer");

  return (
    <section className="bg-primary text-white overflow-hidden">
      {/* LegalWithYou */}
      <div className="relative">
        <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(45deg,rgb(201_169_97/0.08)_0px,rgb(201_169_97/0.08)_1px,transparent_1px,transparent_14px)]"></div>
        <div className="container grid min-h-142.5 max-w-7xl grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
          {/* Content */}
          <div className="max-w-125">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              {t("eyebrow")}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-117.5 font-serif text-4xl font-bold leading-[1.12] md:text-5xl"
            >
              {t("titleStart")}{" "}
              <span className="text-secondary">{t("titleHighlight")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 max-w-117.5 text-sm leading-7 text-white/70"
            >
              {t("description")}
            </motion.p>

            {/* Stores */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="#"
                className="flex h-12 w-36 items-center gap-2 rounded-md bg-black px-3 text-white transition-opacity hover:opacity-85"
              >
                <AppStoreIcon />
                <span className="flex flex-col leading-none">
                  <span className="text-[8px] uppercase">
                    {tFooter("AppStore.Download")}
                  </span>
                  <span className="mt-0.5 text-sm font-medium">
                    {tFooter("AppStore.Name")}
                  </span>
                </span>
              </Link>

              <Link
                href="#"
                className="flex h-12 w-36 items-center gap-2 rounded-md bg-black px-3 text-white transition-opacity hover:opacity-85"
              >
                <PlayStoreIcon />
                <span className="flex flex-col leading-none">
                  <span className="text-[8px] uppercase">
                    {tFooter("GooglePlay.Download")}
                  </span>
                  <span className="mt-0.5 text-sm font-medium">
                    {tFooter("GooglePlay.Name")}
                  </span>
                </span>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="mt-4 text-[11px] text-secondary/60"
            >
              {t("available")}
            </motion.p>
          </div>

          {/* Phones */}
          <div className="relative flex min-h-107.5 items-center justify-center lg:justify-end">
            <div className="relative h-107.5 w-full max-w-120">
              <motion.div
                initial={{ opacity: 0, x: -45, y: 20, rotate: -14 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: -8 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.75,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute left-[12%] z-20 lg:left-[8%]"
              >
                <Image
                  src="/client-phone.png"
                  alt={t("clientPhoneAlt")}
                  width={230}
                  height={460}
                  priority
                  className="w-47.5 rounded-[3rem] border-8 border-white/20 drop-shadow-2xl sm:w-53.75"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 45, y: -10, rotate: 19 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 13 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.75,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute right-[7%] top-0 z-10"
              >
                <Image
                  src="/lawyer-phone.png"
                  alt={t("lawyerPhoneAlt")}
                  width={210}
                  height={420}
                  priority
                  className="w-43.75 rounded-[3rem] border-8 border-white/20 drop-shadow-2xl sm:w-48.75"
                />
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                className="absolute right-[32%] top-[10%] rotate-[8deg] text-[9px] uppercase tracking-[0.18em] text-secondary/70"
              >
                {t("lawyer")}
              </motion.span>

              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute left-[13%] top-[28%] rotate-[-7deg] text-[9px] uppercase tracking-[0.18em] text-secondary/70"
              >
                {t("client")}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency */}
      <div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[70px_1fr_240px] lg:px-8">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex lg:justify-start"
          >
            <div className="flex size-12 items-center justify-center rounded-sm border border-red-500/40 text-red-400">
              <Phone className="size-5" />
            </div>
          </motion.div>

          {/* Emergency Content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-400">
              {t("emergency.eyebrow")}
            </p>

            <h2 className="font-serif text-3xl font-semibold">
              {t("emergency.title")}
            </h2>

            <p className="mt-4 max-w-147.5 text-sm leading-6 text-white/65">
              {t("emergency.description")}
            </p>

            <Button
              variant="outline"
              className="mt-7 border-red-500/50 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Phone className="size-4" />
              {t("emergency.button")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.5,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-white/10 lg:border-s lg:ps-12"
          >
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              {t("emergency.status")}
            </div>

            <p className="mt-2 text-[10px] text-white/35">
              {t("emergency.response")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
