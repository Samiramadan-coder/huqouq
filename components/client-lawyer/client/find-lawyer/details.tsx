import { ExternalLink, Star } from "lucide-react";
import { LawyerDetails } from "@/types/client/find-lawyer";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Details({
  lawyer,
  ratingBreakdown,
}: {
  lawyer: LawyerDetails;
  ratingBreakdown: Record<string, number>;
}) {
  const locale = await getLocale();
  const t = await getTranslations("Client.FindLawyer");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="space-y-14">
      {/* About */}
      <section>
        <div className="mb-7">
          <h2 className={`text-[22px] font-semibold text-primary ${fontClass}`}>
            {t("about")}
          </h2>

          <div className="mt-3 h-px w-10 bg-accent" />
        </div>

        <div className="space-y-4 text-[15px] leading-6 text-primary/75">
          {lawyer.bio}
        </div>

        {lawyer.website_url && (
          <div className="mt-5 flex items-center gap-5 text-[13px] text-primary/50">
            <a
              href={lawyer.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <ExternalLink className="size-3" />

              {t("website")}
            </a>
          </div>
        )}
      </section>

      {/* Education */}
      {lawyer.education?.length > 0 && (
        <section>
          <div className="mb-5">
            <h2
              className={`text-[22px] font-semibold text-primary ${fontClass}`}
            >
              {t("education")}
            </h2>

            <div className="mt-3 h-px w-10 bg-accent" />
          </div>

          <div>
            {lawyer.education.map((item, index) => {
              const isLast = index === lawyer.education.length - 1;

              return (
                <div
                  key={`${item.degree}-${item.university}-${index}`}
                  className="relative flex gap-4"
                >
                  <div className="relative flex w-2 shrink-0 justify-center">
                    {!isLast && (
                      <div className="absolute top-2 bottom-0 w-px bg-accent/30" />
                    )}

                    <div className="relative z-10 mt-1.5 size-2 rounded-full border border-accent bg-background" />
                  </div>

                  <div className={isLast ? "" : "pb-8"}>
                    <h3
                      className={`text-[16px] font-semibold text-primary ${fontClass}`}
                    >
                      {item.degree_label || item.degree}
                    </h3>

                    <p className="mt-1 text-sm text-primary/50">
                      {item.university}
                    </p>

                    <p className="mt-0.5 text-xs text-accent">
                      {item.graduation_year}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Experience */}
      {lawyer.experience?.length > 0 && (
        <section>
          <div className="mb-5">
            <h2
              className={`text-[22px] font-semibold text-primary ${fontClass}`}
            >
              {t("experience")}
            </h2>

            <div className="mt-3 h-px w-10 bg-accent" />
          </div>

          <div>
            {lawyer.experience.map((item, index) => {
              const isLast = index === lawyer.experience.length - 1;

              return (
                <div
                  key={`${item.title}-${item.organization}-${index}`}
                  className="relative flex gap-4"
                >
                  <div className="relative flex w-2 shrink-0 justify-center">
                    {!isLast && (
                      <div className="absolute top-2 bottom-0 w-px bg-accent/30" />
                    )}

                    <div className="relative z-10 mt-1.5 size-2 rounded-full border border-accent bg-background" />
                  </div>

                  <div className={isLast ? "" : "pb-8"}>
                    <h3
                      className={`text-[16px] font-semibold text-primary ${fontClass}`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-primary/50">
                      {item.organization}
                    </p>

                    <p className="mt-0.5 text-xs text-accent">
                      {item.start_year} –{" "}
                      {item.is_current ? t("present") : `${item.end_year}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Services Offered */}
      {lawyer.services?.length > 0 && (
        <section>
          <div className="mb-5">
            <h2
              className={`text-[22px] font-semibold text-primary ${fontClass}`}
            >
              {t("services_offered")}
            </h2>
            <div className="mt-3 h-px w-10 bg-accent" />
          </div>

          <div className="flex flex-wrap gap-2">
            {lawyer.services.map((service) => (
              <div
                key={service.id}
                className="rounded-xs bg-primary/5 border border-primary/20 px-4 py-2 text-[14px] text-primary/75"
              >
                {service.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {lawyer.reviews_count > 0 && (
        <section>
          <div className="mb-7">
            <h2
              className={`text-[22px] font-semibold text-primary ${fontClass}`}
            >
              {t("reviews")}
            </h2>
            <div className="mt-3 h-px w-10 bg-accent" />
          </div>

          <div className="flex items-center gap-9">
            <div className="shrink-0">
              <div
                className={`text-[50px] leading-none font-semibold text-primary ${fontClass}`}
              >
                {lawyer.rating.toFixed(1)}
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-primary/50">
                {lawyer.reviews_count} {t("reviews")}
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingBreakdown?.[String(rating)] ?? 0;
                const percentage =
                  lawyer.reviews_count > 0
                    ? (count / lawyer.reviews_count) * 100
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-2 text-xs text-primary/50">
                      {rating}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/5">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                    <span className="w-5 text-xs text-primary/50">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
