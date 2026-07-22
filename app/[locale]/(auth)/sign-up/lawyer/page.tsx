import AuthCard from "@/components/auth/shared/auth-card";
import SignUpForm from "@/components/auth/sign-up/form";

export default function SignUpLawyerPage() {
  return (
    <AuthCard>
      <SignUpForm guestType="lawyer" />
    </AuthCard>
  );
}
