"use client";

import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import AppStoreIcon from "@/components/icons/app-store";
import PlayStoreIcon from "@/components/icons/play-store";

export function LegalWithYou() {
  const t = useTranslations("Home.LegalWithYou");
  const tFooter = useTranslations("Footer");

  return (
    <section className="bg-primary text-white">
      {/* Hero */}
      <div className="bg-[repeating-linear-gradient(45deg,rgb(201_169_97/0.08)_0px,rgb(201_169_97/0.08)_1px,transparent_1px,transparent_14px)]">
        <div className="container grid min-h-142.5 max-w-7xl grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
          {/* Content */}
          <div className="max-w-125">
            <p className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-secondary uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="max-w-117.5 font-serif text-4xl leading-[1.12] font-bold md:text-5xl">
              {t("titleStart")}{" "}
              <span className="text-secondary">{t("titleHighlight")}</span>
            </h2>
            <p className="mt-6 max-w-117.5 text-sm leading-7 text-white/70">
              {t("description")}
            </p>

            {/* Stores */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#"
                className="flex gap-2 h-12 w-36 items-center rounded-md bg-black px-3 text-white transition-opacity hover:opacity-85"
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
                className="flex gap-2 h-12 w-36 items-center rounded-md bg-black px-3 text-white transition-opacity hover:opacity-85"
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
            </div>

            <p className="mt-4 text-[11px] text-secondary/60">
              {t("available")}
            </p>
          </div>

          {/* Phones */}
          <div className="relative flex min-h-107.5 items-center justify-center lg:justify-end">
            <div className="relative h-107.5 w-full max-w-120">
              <Image
                src="/client-phone.png"
                alt={t("clientPhoneAlt")}
                width={230}
                height={460}
                priority
                className="
                  absolute
                  left-[12%]
                  z-20
                  w-47.5
                  rotate-[-8deg]
                  drop-shadow-2xl
                  sm:w-53.75
                  lg:left-[8%]
                  rounded-[3rem]
                  border-8
                  border-white/20
                "
              />

              <Image
                src="/lawyer-phone.png"
                alt={t("lawyerPhoneAlt")}
                width={210}
                height={420}
                priority
                className="
                  absolute
                  top-0
                  right-[7%]
                  z-10
                  w-43.75
                  rotate-13
                  drop-shadow-2xl
                  sm:w-48.75
                  rounded-[3rem]
                  border-8
                  border-white/20
                "
              />

              <span className="absolute top-[10%] right-[32%] rotate-[8deg] text-[9px] tracking-[0.18em] text-secondary/70 uppercase">
                {t("lawyer")}
              </span>

              <span className="absolute top-[28%] left-[13%] rotate-[-7deg] text-[9px] tracking-[0.18em] text-secondary/70 uppercase">
                {t("client")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency */}
      <div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-[70px_1fr_240px] lg:px-8">
          {/* Icon */}
          <div className="flex lg:justify-start">
            <div className="flex size-12 items-center justify-center rounded-sm border border-red-500/40 text-red-400">
              <Phone className="size-5" />
            </div>
          </div>

          {/* Emergency Content */}
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-red-400 uppercase">
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
              className="
                mt-7
                border-red-500/50
                bg-transparent
                text-red-400
                hover:bg-red-500/10
                hover:text-red-300
              "
            >
              <Phone className="size-4" />

              {t("emergency.button")}

              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>

          {/* Status */}
          <div className="border-white/10 lg:border-s lg:ps-12">
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              {t("emergency.status")}
            </div>

            <p className="mt-2 text-[10px] text-white/35">
              {t("emergency.response")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
