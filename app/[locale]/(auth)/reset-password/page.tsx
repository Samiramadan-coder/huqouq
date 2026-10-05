import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ResetPasswordForm from "@/components/auth/reset-password/form";
import AuthCard from "@/components/auth/shared/auth-card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ResetPassword");

  return {
    title: `${t("title")} | Huqouq`,
    description: t("description"),
  };
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string | string[] }>;
}) {
  const { phone } = await searchParams;
  // Only prefill a phone number carried over from the forgot-password step
  const defaultPhone =
    typeof phone === "string" && /^5[024568]\d{7}$/.test(phone) ? phone : "";

  return (
    <AuthCard>
      <ResetPasswordForm defaultPhone={defaultPhone} />
    </AuthCard>
  );
}
