"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/icons/logo";
import { useLocale, useTranslations } from "next-intl";
import { SignInWithEmail } from "./sign-in-with-email";
import { SignInWithPhone } from "./sign-in-with-phone";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignInForm() {
  const locale = useLocale();
  const t = useTranslations("SignUp");
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
          Welcome Back
        </h1>
        <p className="text-sm text-foreground">
          Sign in to continue to your account.
        </p>
      </div>

      <div className="flex p-1 h-12 bg-border/50 rounded-full">
        <Button
          className={cn("flex-1 h-full rounded-full", {
            "bg-white": liveRegion === "email",
          })}
          variant="ghost"
          onClick={() => setLiveRegion("email")}
        >
          Email
        </Button>
        <Button
          className={cn("flex-1 h-full rounded-full", {
            "bg-white": liveRegion === "phone",
          })}
          variant="ghost"
          onClick={() => setLiveRegion("phone")}
        >
          Phone
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
        {t("socialSignUp")}
      </div>

      <p className="text-center text-xs text-primary/80 sm:col-span-2">
        Don&apos;t have an account?{" "}
        <Link href="/get-started" className="text-secondary hover:underline">
          Get started
        </Link>
      </p>
    </div>
  );
}
