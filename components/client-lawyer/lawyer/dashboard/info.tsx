"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Info() {
  const locale = useLocale();
  const { user } = useUser();
  const t = useTranslations("Lawyer.Dashboard");

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user?.photo_url || ""} />
        <AvatarFallback>
          {user?.first_name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h3
          className={cn(
            "text-lg font-semibold",
            locale === "en" && "font-lora",
          )}
        >
          {user?.first_name} {user?.last_name}
        </h3>
        <p className="text-xs text-primary/45 mt-0.5">{user?.email}</p>
        <Button variant="link" className="p-0 text-xs text-secondary">
          {t("ChangePhoto")}
        </Button>
      </div>
    </div>
  );
}
