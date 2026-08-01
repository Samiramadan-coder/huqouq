import Image from "next/image";
import { Button } from "../ui/button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Hero() {
  const t = await getTranslations("Home.Hero");

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-primary">
      <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,white_40px,white_41px)]" />

      <div className="container relative grid max-w-7xl items-center gap-16 py-40 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="max-w-2xl">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-secondary">
            {t("Eyebrow")}
          </p>

          <h1 className="mb-6 text-balance font-lora text-4xl font-semibold leading-[1.15] text-white md:text-5xl lg:text-[3.25rem]">
            {t("Title.Line1")}
            <br />
            {t("Title.Line2")}
            <br />
            <span className="text-[#d5ae58]">{t("Title.Highlight")}</span>
          </h1>

          <p className="mb-10 max-w-lg font-sans text-base leading-relaxed text-white/60">
            {t("Description")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
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
                  border-slate-400 bg-transparent
                  text-white hover:bg-white/10 hover:text-white
                "
              >
                {t("Actions.Lawyer")}
              </Button>
            </Link>
          </div>

          <p className="mt-9 text-xs tracking-wide text-white/35">
            {t("Stats.Lawyers")}
            <span className="mx-2">·</span>
            {t("Stats.Specializations")}
            <span className="mx-2">·</span>
            {t("Stats.Location")}
          </p>
        </div>

        <div className="relative mx-auto w-full">
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
        </div>
      </div>
    </div>
  );
}
