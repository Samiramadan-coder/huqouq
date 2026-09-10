import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { LawyerDetails } from "@/types/client/find-lawyer";
import { Clock3, Heart, ShieldCheck, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function DefinitionCard({
  lawyer,
}: {
  lawyer: LawyerDetails;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.FindLawyer");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <Card
      className="rounded-md ring-0! border border-secondary p-0"
      style={{ boxShadow: "none" }}
    >
      <CardContent className="px-7 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="relative size-32 overflow-hidden rounded-full border-2 border-[#e8dcc4]">
              <Image
                src={lawyer.photo_url || "/avatar-1.png"}
                alt={lawyer.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border-2 border-accent bg-primary">
              <ShieldCheck className="size-5 text-accent" />
            </div>
          </div>

          <h3
            className={`${fontClass} mt-5 text-[1.25rem] font-semibold leading-none text-primary mb-1`}
          >
            {lawyer.name}
          </h3>

          <p className="text-xs text-primary/50 text-center tracking-wide">
            {t("independentPractice")} · {lawyer.years_of_experience}{" "}
            {t("years")}
            <br />
            {t("experience")}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-accent text-accent" />
              ))}
            </div>

            <span className="text-xs text-slate-400">
              {lawyer.rating} ({lawyer.reviews_count} {t("reviews")})
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-primary/50">
            <Clock3 className="size-3.5" />
            <span>{t("usuallyRespondsWithinAnHour")}</span>
          </div>

          <div className="mt-5 flex max-w-52.5 flex-wrap justify-center gap-2">
            {lawyer.specializations.map((specialization, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded border-secondary px-3 py-2 text-[11px] font-normal text-primary/50"
              >
                {specialization.name}
              </Badge>
            ))}
          </div>

          <p className="mt-4 text-xs text-primary/45">
            {lawyer.languages.join(" · ")}
          </p>
        </div>

        <Separator className="my-6 bg-secondary" />

        <div className="space-y-2.5">
          <Button
            variant="outline"
            className="h-11 w-full rounded border-primary bg-white text-sm font-normal text-primary hover:bg-slate-50"
          >
            {t("message")}
          </Button>

          <Button
            asChild
            className="h-10 w-full rounded bg-accent text-sm font-normal text-primary hover:bg-accent"
          >
            <Link href={`/client/my-cases/create?lawyerId=${lawyer.id}`}>
              {t("sendDirectHireRequest")}
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-15 w-full flex-col gap-0 rounded border-accent bg-white text-accent hover:bg-[#fffdf8]"
          >
            <span className="text-sm">{t("bookAConsultation")}</span>
            <span className="text-[11px] font-normal text-accent">
              {t("freeLaunchPeriod")}
            </span>
          </Button>
        </div>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-1.5 py-2 text-xs text-slate-400 transition-colors hover:text-primary"
        >
          <Heart className="size-3.5" />
          {t("saveToFavourites")}
        </button>
      </CardContent>
    </Card>
  );
}
