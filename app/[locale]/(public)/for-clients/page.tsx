import Hero from "@/components/public/for-clients/hero";
import Stats from "@/components/public/for-clients/stats";
import Advantages from "@/components/public/for-clients/advantages";
import Options from "@/components/public/for-clients/options";
import Expertise from "@/components/public/for-clients/expertise";
import CTA from "@/components/public/for-clients/cta";

export default function Page() {
  return (
    <main>
      <Hero />
      <Stats />
      <Advantages />
      <Options />
      <Expertise />
      <CTA />
    </main>
  );
}
