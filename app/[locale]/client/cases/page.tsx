import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("Client.Cases");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="space-y-6">
      <h1 className={cn("text-2xl font-semibold", fontClass)}>
        {t("MyCases")}
      </h1>

      <div>2</div>
      <div>3</div>
    </div>
  );
}
