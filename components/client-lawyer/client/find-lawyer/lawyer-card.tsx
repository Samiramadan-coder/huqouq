import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import AddToFavorite from "./add-to-favorite";
import { Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { Lawyer } from "@/types/client/find-lawyer";
import { getTranslations } from "next-intl/server";

export default async function LawyerCard({
  lawyer,
  index,
  caseId,
}: {
  lawyer: Lawyer;
  index: number;
  caseId?: string;
}) {
  const t = await getTranslations("Client.FindLawyer");

  return (
    <Card
      key={lawyer.id}
      className="group overflow-hidden rounded-md border border-secondary hover:border-accent/50 bg-white p-0 !ring-0!"
      style={{ boxShadow: "none" }}
    >
      <div className="relative aspect-410/545 w-full overflow-hidden bg-muted">
        <Image
          src={lawyer.photo_url || "/avatar.png"}
          alt={lawyer.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          loading={index < 3 || !lawyer.photo_url ? "eager" : "lazy"}
          className="object-cover group-hover:scale-105 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        <AddToFavorite
          name={lawyer.name}
          id={lawyer.id}
          isFavourite={lawyer.is_favorite}
        />

        {lawyer.verified && (
          <div
            role="img"
            aria-label={t("verified")}
            className="absolute bottom-3 inset-e-3 flex size-9 items-center justify-center rounded-full bg-[#d0a441]"
          >
            <Shield
              className="size-4 fill-primary text-primary"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      <CardContent className="space-y-4 px-5 py-5">
        <div>
          <h2
            className={`text-base font-semibold leading-tight text-primary mb-2 wrap-break-word ltr:font-lora`}
          >
            {lawyer.name}
          </h2>

          <p className="text-xs text-primary/50 mb-3">
            {t("lawyer")} · {lawyer.years_of_experience} {t("yearsExperience")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`size-3 ${
                  index < (lawyer.rating ?? 0)
                    ? "fill-accent text-accent"
                    : "fill-primary/20 text-primary/20"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-primary/60">
            {lawyer.rating} ({lawyer.reviews_count})
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {lawyer.specializations.map((specialization) => (
            <Badge
              key={specialization.id}
              variant="outline"
              className="rounded-full border-secondary px-3 py-1 font-normal text-primary/70 h-6.5"
            >
              {specialization.name}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-primary/60">
          {t("usuallyRespondsWithinAnHour")}
        </p>

        <Link
          href={`/client/find-lawyers/${lawyer.id}${
            caseId ? `?caseId=${caseId}` : ""
          }`}
          className="inline-flex text-sm font-medium text-accent transition-opacity hover:opacity-70"
        >
          {t("viewProfile")}
        </Link>
      </CardContent>
    </Card>
  );
}
