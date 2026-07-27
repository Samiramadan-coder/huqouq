import Link from "next/link";
import { Button } from "../ui/button";
import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CTA() {
  const t = await getTranslations("Home.CTA");

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="container max-w-3xl text-center">
        <div className="mb-7 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-secondary/40" />
          <ShieldCheck size={20} strokeWidth={1.3} className="text-secondary" />
          <span className="h-px w-16 bg-secondary/40" />
        </div>

        <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-secondary">
          {t("Label")}
        </p>

        <h2 className="font-lora text-4xl font-semibold text-primary md:text-5xl">
          {t("Title")}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground">
          {t("Description")}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-12 min-w-46 rounded-sm bg-secondary px-8 text-primary hover:bg-secondary/90"
          >
            <Link href="/cases/create">{t("Actions.Client")}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 min-w-40 rounded-sm border-primary/20 bg-transparent px-8 text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/lawyer/register">{t("Actions.Lawyer")}</Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center text-xs tracking-wide text-muted-foreground/50">
          <span>{t("Footer.Subscription")}</span>
          <span className="mx-2">·</span>
          <span>{t("Footer.Verified")}</span>
          <span className="mx-2">·</span>
          <span>{t("Footer.Secure")}</span>
        </div>
      </div>
    </section>
  );
}
