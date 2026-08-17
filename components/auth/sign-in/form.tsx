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
          onClick={() => setLiveRegion("email")}
        >
          {t("fields.email.label")}
        </Button>
        <Button
          className={cn("flex-1 h-full text-[13px] rounded-full", {
            "bg-white text-primary": liveRegion === "phone",
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

      <div className="flex gap-3 items-center sm:col-span-2">
        <Button
          variant="outline"
          className="flex-1 bg-transparent h-10 rounded-sm border-[#c8c0b0] font-normal text-[13px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          Google
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent h-10 rounded-sm border-[#c8c0b0] font-normal text-[13px]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="#1B3A57"
            aria-hidden="true"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"></path>
          </svg>
          Apple
        </Button>
      </div>

      <p className="text-center text-xs text-primary/80 sm:col-span-2">
        {t("dontHaveAccount")}{" "}
        <Link href="/get-started" className="text-accent hover:underline">
          {t("getStarted")}
        </Link>
      </p>
    </div>
  );
}
