import Expertise from "@/components/landing/expertise";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";

export default async function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Expertise />
    </main>
  );
}
