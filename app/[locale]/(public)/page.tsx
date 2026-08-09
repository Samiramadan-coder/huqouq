import Consultations from "@/components/public/landing/consultations";
import CTA from "@/components/public/landing/cta";
import Expertise from "@/components/public/landing/expertise";
import Hero from "@/components/public/landing/hero";
import HowItWorks from "@/components/public/landing/how-it-works";
import LegalServices from "@/components/public/landing/legal-services";
import { LegalWithYou } from "@/components/public/landing/legal-with-you";
import Professionals from "@/components/public/landing/professionals";

export default async function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Expertise />
      <LegalServices />
      <Professionals />
      <Consultations />
      <LegalWithYou />
      <CTA />
    </main>
  );
}
