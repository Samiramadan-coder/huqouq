import Hero from "@/components/public/for-clients/hero";
import Stats from "@/components/public/for-clients/stats";
import Advantages from "@/components/public/for-clients/advantages";
import Options from "@/components/public/for-clients/options";
import Expertise from "@/components/public/for-clients/expertise";
import CTA from "@/components/public/for-clients/cta";
import LegalServices from "@/components/public/for-clients/legal-services";
import HowItWorks from "@/components/public/for-clients/how-it-works";

export default function Page() {
  return (
    <main>
      <Hero />
      <Stats />
      <Advantages />
      <Options />
      <Expertise />
      <LegalServices />
      <HowItWorks />
      <CTA />
    </main>
  );
}
