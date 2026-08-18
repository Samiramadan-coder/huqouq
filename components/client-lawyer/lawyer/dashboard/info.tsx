"use client";

import {
  Star,
  Clock3,
  BadgeCheck,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { Separator } from "@/components/ui/separator";
import WelcomeText from "../../reusable/welcome-text";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Info() {
  const { user } = useUser();
  const locale = useLocale();
  const lawyer = user?.lawyer_profile;
  const t = useTranslations("Lawyer.Dashboard");

  const nextSectionToFill = lawyer?.review_items.find(
    (item) => !item.is_complete,
  );

  return (
    <div className="space-y-6">
      <WelcomeText />

      {/* Profile Section */}
      <div className="flex w-full items-center justify-between flex-wrap gap-6 rounded-xs bg-primary px-6 py-5 text-white">
        <div className="flex min-w-0 items-center gap-5">
          <div className="relative shrink-0">
            <Avatar className="size-16.5 border-2 border-white/25">
              <AvatarImage
                src={user?.photo_url || ""}
                alt={user?.name || "User Avatar"}
                className="object-cover"
              />
              <AvatarFallback className="uppercase">
                {user?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            {lawyer?.profile_status === "approved" && (
              <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-accent ring-2 ring-primary/90">
                <BadgeCheck className="size-3 text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={cn(
                  "text-xl font-bold leading-none",
                  locale === "en" && "font-lora",
                )}
              >
                {user?.first_name} {user?.last_name}
              </h2>

              {lawyer?.profile_status === "approved" && (
                <Badge
                  variant="outline"
                  className="h-5 rounded-xs border-accent/70 px-2 text-[10px] font-normal text-accent"
                >
                  {t("Verified")}
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {lawyer?.specializations?.map((item) => (
                <Badge
                  key={item.id}
                  variant="outline"
                  className="h-5 rounded-xs border-accent/70 px-2 text-[10px] font-normal text-accent"
                >
                  {item.name}
                </Badge>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/65">
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-accent text-accent" />
                <span>
                  <span className="font-medium text-white/65">4.8</span> (32{" "}
                  {t("Reviews")})
                </span>
              </div>

              <Separator orientation="vertical" className="h-4 bg-white/20" />

              <div className="flex items-center gap-1.5">
                <BriefcaseBusiness className="size-3.5 text-white/65" />
                <span>14 {t("CasesHandled")}</span>
              </div>

              <Separator orientation="vertical" className="h-4 bg-white/20" />

              <div className="flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-white/65" />
                <span>{t("RespondsWithinAnHour")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right ms-auto">
          <p className="text-[11px] text-white/65">{t("MemberSince")}</p>
          <p className="mt-1 text-sm text-white/65">
            {formatDate(user?.created_at || new Date())}
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex w-full items-center justify-between flex-wrap gap-6 rounded-xs border border-[#EDE9E1] bg-white px-5 py-5">
        <div className="flex min-w-0 items-center gap-5">
          <div
            className="shrink-0 flex size-13.5 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(
                #c9a448 ${(lawyer?.completion_percentage || 0) * 3.6}deg,
                #e7e5df ${(lawyer?.completion_percentage || 0) * 3.6}deg
              )`,
            }}
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-white">
              <span className="text-xs font-semibold text-primary">
                {lawyer?.completion_percentage}%
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0">
            <h3
              className={cn(
                "text-sm font-semibold text-primary",
                locale === "en" && "font-lora",
              )}
            >
              {lawyer?.completion_percentage}% {t("Complete")}
            </h3>

            {nextSectionToFill && (
              <p className="mt-0.5 text-sm text-primary/50 leading-relaxed">
                {t("Next")}: {nextSectionToFill.item_label}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {lawyer?.review_items.map((item) => (
                <Link key={item.item} href="/lawyer/profile">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5.5 rounded-xs  px-2 text-[10px] font-normal",
                      {
                        "text-accent border-accent/30 bg-accent/10":
                          item.is_complete,
                        "text-gray-400 border-gray-200 bg-gray-50":
                          !item.is_complete,
                      },
                    )}
                  >
                    {item.item_label}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Action */}
        {lawyer?.profile_status !== "approved" &&
          lawyer?.profile_status !== "in_review" && (
            <div className="shrink-0 ms-auto">
              <Link href="/lawyer/profile" className="shrink-0">
                <Button
                  variant="outline"
                  className="h-10 shrink-0 rounded-sm border border-accent/30 px-4 font-normal text-primary bg-transparent hover:bg-[#fffaf0]"
                >
                  {t("CompleteProfile")}
                  <ChevronRight className="ml-2 size-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          )}

        {lawyer?.profile_status === "in_review" && (
          <Badge className="bg-primary/5 border border-primary/20 text-primary h-8 px-3">
            {t("InReview")}
          </Badge>
        )}
      </div>
    </div>
  );
}
