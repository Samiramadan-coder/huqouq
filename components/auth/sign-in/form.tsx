"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { SignInWithEmail } from "./sign-in-with-email";
import { SignInWithPhone } from "./sign-in-with-phone";

export default function SignInForm() {
  const locale = useLocale();
  const t = useTranslations("SignIn");
  const [liveRegion, setLiveRegion] = useState<"email" | "phone">("email");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <h1
          className={cn(
            "mb-1 text-center text-[1.6rem] font-bold text-primary",
            { "font-lora": locale === "en" },
          )}
        >
          {t("welcomeBack")}
        </h1>
        <p className="text-sm text-foreground">{t("signInToYourAccount")}</p>
      </div>

      <div className="flex p-1 h-12 bg-border/50 rounded-full">
        <Button
          className={cn("flex-1 h-full rounded-full", {
            "bg-white": liveRegion === "email",
          })}
          variant="ghost"
          onClick={() => setLiveRegion("email")}
        >
          {t("fields.email.label")}
        </Button>
        <Button
          className={cn("flex-1 h-full rounded-full", {
            "bg-white": liveRegion === "phone",
          })}
          variant="ghost"
          onClick={() => setLiveRegion("phone")}
        >
          {t("fields.phone.label")}
        </Button>
      </div>

      {liveRegion === "email" && <SignInWithEmail />}

      {liveRegion === "phone" && <SignInWithPhone />}

      <div className="relative border-t border-border sm:col-span-2">
        <span className="absolute left-1/2 -top-2 -translate-x-1/2 inline-block bg-white px-2 text-xs text-border">
          {t("continueWith")}
        </span>
      </div>

      <div className="text-center text-xs text-muted-foreground sm:col-span-2">
        {t("socialSignIn")}
      </div>

      <p className="text-center text-xs text-primary/80 sm:col-span-2">
        {t("dontHaveAccount")}{" "}
        <Link href="/get-started" className="text-secondary hover:underline">
          {t("getStarted")}
        </Link>
      </p>
    </div>
  );
}
