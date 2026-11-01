"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import AuthLogo from "@/components/icons/auth-logo";
import { useLocale, useTranslations } from "next-intl";
import { SignInWithEmail } from "./sign-in-with-email";
import { SignInWithPhone } from "./sign-in-with-phone";

export default function SignInForm() {
  const locale = useLocale();
  const t = useTranslations("SignIn");
  const [liveRegion, setLiveRegion] = useState<"email" | "phone">("email");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <AuthLogo />
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

      <div className="flex p-0.5 h-10 bg-[#ede9e2] rounded-full">
        <Button
          className={cn("flex-1 h-full text-[13px] rounded-full", {
            "bg-white text-primary": liveRegion === "email",
          })}
          variant="ghost"
          aria-pressed={liveRegion === "email"}
          onClick={() => setLiveRegion("email")}
        >
          {t("fields.email.label")}
        </Button>
        <Button
          className={cn("flex-1 h-full text-[13px] rounded-full", {
            "bg-white text-primary": liveRegion === "phone",
          })}
          variant="ghost"
          aria-pressed={liveRegion === "phone"}
          onClick={() => setLiveRegion("phone")}
        >
          {t("fields.phone.label")}
        </Button>
      </div>

      {liveRegion === "email" && <SignInWithEmail />}

      {liveRegion === "phone" && <SignInWithPhone />}

      <p className="text-center text-xs text-primary/80 sm:col-span-2">
        {t("dontHaveAccount")}{" "}
        <Link href="/get-started" className="text-accent hover:underline">
          {t("getStarted")}
        </Link>
      </p>
    </div>
  );
}
