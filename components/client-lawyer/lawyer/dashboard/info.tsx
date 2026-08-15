"use client";

import { cn, formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useUser } from "@/providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, BriefcaseBusiness, Clock3, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const formattedDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
}).format(new Date());

export default function Info() {
  const { user } = useUser();
  const locale = useLocale();

  console.log("user", user);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={cn(
            "text-2xl font-semibold",
            locale === "en" && "font-lora",
          )}
        >
          Good evening, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-primary/40">{formattedDate}</p>
      </div>

      <div className="flex w-full items-center justify-between gap-6 rounded-sm bg-primary px-6 py-5 text-white">
        {/* Left Side */}
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
            <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-secondary ring-2 ring-primary/90">
              <BadgeCheck className="size-3 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0">
            {/* Name */}
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={cn(
                  "text-xl font-bold leading-none",
                  locale === "en" && "font-lora",
                )}
              >
                {user?.first_name} {user?.last_name}
              </h2>

              <Badge
                variant="outline"
                className="h-5 rounded-xs border-secondary/70 px-2 text-[10px] font-normal text-secondary"
              >
                Verified
              </Badge>
            </div>

            {/* Specialities */}
            <div className="mt-2 flex flex-wrap gap-2">
              {user?.lawyer_profile?.specializations?.map((item) => (
                <Badge
                  key={item.id}
                  variant="outline"
                  className="h-5 rounded-xs border-secondary/70 px-2 text-[10px] font-normal text-secondary"
                >
                  {item.name}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/65">
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5 fill-secondary text-secondary" />
                <span>
                  <span className="font-medium text-white/65">4.8</span> (32
                  reviews)
                </span>
              </div>

              <Separator orientation="vertical" className="h-4 bg-white/20" />

              <div className="flex items-center gap-1.5">
                <BriefcaseBusiness className="size-3.5 text-white/65" />
                <span>14 cases handled</span>
              </div>

              <Separator orientation="vertical" className="h-4 bg-white/20" />

              <div className="flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-white/65" />
                <span>Responds within an hour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-white/65">Member since</p>
          <p className="mt-1 text-sm text-white/65">
            {formatDate(user?.created_at || new Date())}
          </p>
        </div>
      </div>
    </div>
  );
}
