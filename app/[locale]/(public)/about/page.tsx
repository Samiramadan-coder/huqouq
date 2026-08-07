import Hero from "@/components/public/about/hero";
import Story from "@/components/public/about/story";
import Values from "@/components/public/about/values";
import Verification from "@/components/public/about/verifications";
import Why from "@/components/public/about/why";

export default function Page() {
  return (
    <main>
      <Hero />
      <Story />
      <Why />
      <Values />
      <Verification />
    </main>
  );
}
