import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthCard from "@/components/auth/shared/auth-card";
import SignUpForm from "@/components/auth/sign-up/form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SignUp");

  return {
    title: `${t("createAccount")} | Huqouq`,
  };
}

export default function SignUpClientPage() {
  return (
    <AuthCard>
      <SignUpForm guestType="client" />
    </AuthCard>
  );
}
