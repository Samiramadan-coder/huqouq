import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Lawyer } from "@/types/client/find-lawyer";
import { ChevronRight, MoveRight, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RecommendedLawyers({
  recommendedLawyers,
}: {
  recommendedLawyers: Lawyer[];
}) {
  const t = useTranslations("Client.Dashboard");
  const lawyers = recommendedLawyers.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary ltr:font-lora">
          {t("recommendedLawyers")}
        </h3>

        <Link
          href="/client/find-lawyers"
          className="flex items-center gap-1 text-accent font-normal text-sm"
        >
          {t("browseAllLawyers")}
          <MoveRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>

      {lawyers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lawyers.map((lawyer) => (
            <Link
              key={lawyer.id}
              href={`/client/find-lawyers/${lawyer.id}`}
              className="group flex items-center gap-4 rounded-sm border border-secondary bg-white p-4 transition-colors hover:border-accent/40"
            >
              <Avatar className="size-12 shrink-0">
                <AvatarImage
                  src={lawyer.photo_url || "/avatar.png"}
                  alt={lawyer.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                  {lawyer.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-primary ltr:font-lora">
                  {lawyer.name}
                </p>
                <p className="truncate text-xs uppercase tracking-wide text-accent">
                  {lawyer.specializations.map((s) => s.name).join(", ")}
                </p>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-primary/45">
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-3 ${
                          index < Math.round(lawyer.rating ?? 0)
                            ? "fill-accent text-accent"
                            : "fill-transparent text-accent/60"
                        }`}
                      />
                    ))}
                  </div>
                  <span>({lawyer.reviews_count})</span>
                  <span>
                    · {t("yearsShort", { count: lawyer.years_of_experience })}
                  </span>
                </div>
              </div>

              <ChevronRight className="size-4 shrink-0 text-primary/30 transition-colors group-hover:text-accent rtl:rotate-180" />
            </Link>
          ))}
        </div>
      ) : (
        <span className="text-sm text-primary/55">
          {t("noRecommendedLawyers")}
        </span>
      )}
    </div>
  );
}
