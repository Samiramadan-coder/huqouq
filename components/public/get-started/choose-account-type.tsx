"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, BriefcaseBusiness, Scale } from "lucide-react";

type AccountType = "client" | "lawyer";

export default function ChooseAccountType() {
  const t = useTranslations("GetStarted");
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("client");

  function handleContinue() {
    const path =
      accountType === "client" ? "/sign-up/client" : "/sign-up/lawyer";

    router.push(path);
  }

  return (
    <>
      <RadioGroup
        value={accountType}
        onValueChange={(value) => setAccountType(value as AccountType)}
        className="mt-10 gap-4"
      >
        <AccountTypeCard
          value="client"
          selected={accountType === "client"}
          icon={<BriefcaseBusiness className="size-5" />}
          title={t("client.title")}
          description={t("client.description")}
        />

        <AccountTypeCard
          value="lawyer"
          selected={accountType === "lawyer"}
          icon={<Scale className="size-5" />}
          title={t("lawyer.title")}
          description={t("lawyer.description")}
        />
      </RadioGroup>

      <Button
        type="button"
        onClick={handleContinue}
        className="mt-8 h-13 w-full rounded-md bg-primary text-base font-semibold text-white hover:bg-primary/90"
      >
        {t("continue")}
        <ArrowRight className="size-4 rtl:rotate-180" />
      </Button>
    </>
  );
}

function AccountTypeCard({
  value,
  selected,
  icon,
  title,
  description,
}: {
  value: AccountType;
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const locale = useLocale();

  return (
    <Label htmlFor={value} className="block cursor-pointer">
      <Card
        className={cn(
          "flex min-h-28 flex-row items-start gap-4 rounded-lg border bg-white px-6 py-5 shadow-none transition-colors",
          selected
            ? "border-primary bg-primary/3"
            : "border-secondary hover:border-secondary",
        )}
      >
        <span
          className={cn(
            "mt-0.5 shrink-0",
            selected ? "text-primary" : "text-secondary",
          )}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-lg font-semibold text-primary",
              locale === "en" && "font-lora",
            )}
          >
            {title}
          </span>

          <span className="mt-1 block text-sm leading-6 text-foreground">
            {description}
          </span>
        </span>

        <RadioGroupItem
          id={value}
          value={value}
          className="mt-0.5 border-secondary text-primary"
        />
      </Card>
    </Label>
  );
}
