import Advantages from "@/components/public/for-lawyers/advantages";
import CTA from "@/components/public/for-lawyers/cta";
import GettingStarted from "@/components/public/for-lawyers/getting-started";
import Hero from "@/components/public/for-lawyers/hero";
import MarketDemand from "@/components/public/for-lawyers/market-demand";
import Stats from "@/components/public/for-lawyers/stats";

export default function Page() {
  return (
    <main>
      <Hero />
      <Stats />
      <Advantages />
      <MarketDemand />
      <GettingStarted />
      <CTA />
    </main>
  );
}
