import Image from "next/image";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ChooseAccountType from "@/components/public/get-started/choose-account-type";

export default async function GetStartedPage() {
  const t = await getTranslations("GetStarted");
  const locale = await getLocale();

  return (
    <main className="grid min-h-[calc(100vh-6rem)] lg:grid-cols-2">
      <section className="bg-[#f8f6f2] px-5 py-12 sm:px-10 lg:px-16 xl:px-20">
        <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
          <p className="mb-7 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
            {t("eyebrow")}
          </p>

          <h1
            className={cn(
              "max-w-lg font-semibold leading-tight text-primary",
              locale === "en" && "font-lora text-2xl sm:text-4xl",
              locale === "ar" && "text-2xl sm:text-4xl",
            )}
          >
            {t("title")}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-7 text-foreground">
            {t("description")}
          </p>

          <ChooseAccountType />

          <p className="mt-5 text-center text-sm text-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/sign-in"
              className="font-medium text-accent hover:underline"
            >
              {t("signIn")}
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden items-center justify-center bg-primary p-10 lg:flex xl:p-16">
        <div className="w-full max-w-md rounded-xl border border-accent p-3">
          <div className="relative aspect-4/5 overflow-hidden rounded-lg">
            <Image
              src="/get-started-hero.png"
              alt={t("imageAlt")}
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
