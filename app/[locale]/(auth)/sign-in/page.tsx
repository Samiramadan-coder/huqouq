import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SignInForm from "@/components/auth/sign-in/form";
import AuthCard from "@/components/auth/shared/auth-card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SignIn");

  return {
    title: `${t("signIn")} | Huqouq`,
    description: t("signInToYourAccount"),
  };
}

export default function SignInPage() {
  return (
    <AuthCard>
      <SignInForm />
    </AuthCard>
  );
}
