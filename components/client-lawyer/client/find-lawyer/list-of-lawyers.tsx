import Image from "next/image";
import { Meta } from "@/types/shared";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Star } from "lucide-react";
import { Lawyer } from "@/types/client/find-lawyer";
import { Card, CardContent } from "@/components/ui/card";
import ListOfLawyersHeader from "./list-of-lawyers-header";
import { getLocale, getTranslations } from "next-intl/server";
import PaginationTemplate from "../../reusable/pagination-template";

export default async function ListOfLawyers({
  lawyers,
  pagination,
  caseId,
}: {
  lawyers: Lawyer[];
  pagination: Meta;
  caseId?: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.FindLawyer");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="space-y-3">
      <ListOfLawyersHeader total={pagination.total} />

      {lawyers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((lawyer) => (
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
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-3 size-9 rounded-full bg-white text-slate-400 shadow-sm hover:bg-white hover:text-rose-500"
                  >
                    <Heart className="size-4" />
                  </Button>

                  <div className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-[#d0a441]">
                    <Shield className="size-4 fill-primary text-primary" />
                  </div>
                </div>

                <CardContent className="space-y-4 px-5 py-5">
                  <div>
                    <h3
                      className={`text-base font-semibold leading-none text-primary mb-2 ${fontClass}`}
                    >
                      {lawyer.name}
                    </h3>

                    <p className="text-xs text-primary/50 mb-3">
                      {t("lawyer")} · {lawyer.years_of_experience}{" "}
                      {t("yearsExperience")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="size-3 fill-accent text-accent"
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
            ))}
          </div>

          <PaginationTemplate
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        </>
      ) : (
        <p className="text-sm text-primary/50">No lawyers found</p>
      )}
    </div>
  );
}
