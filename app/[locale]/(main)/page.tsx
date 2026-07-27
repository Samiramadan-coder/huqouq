import Consultations from "@/components/landing/consultations";
import CTA from "@/components/landing/cta";
import Expertise from "@/components/landing/expertise";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import LegalServices from "@/components/landing/legal-services";
import Professionals from "@/components/landing/professionals";

export default async function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Expertise />
      <LegalServices />
      <Professionals />
      <Consultations />
      <CTA />
    </main>
  );
}
