import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ForgotPasswordForm } from "@/components/auth/forgot-password/form";
import AuthCard from "@/components/auth/shared/auth-card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ForgotPassword");

  return {
    title: `${t("title")} | Huqouq`,
    description: t("description"),
  };
}

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
