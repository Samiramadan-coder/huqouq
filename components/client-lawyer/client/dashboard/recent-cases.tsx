import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { MoveRight } from "lucide-react";
import { getLocale } from "next-intl/server";
import { CaseDetails } from "@/types/client/cases";
import { CasesTable } from "../cases/data-preview";

export default async function RecentCases({ cases }: { cases: CaseDetails[] }) {
  const t = await getTranslations("Client.Dashboard");
  const locale = await getLocale();
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold text-primary ${fontClass}`}>
          {t("recentCases")}
        </h3>

        <Link
          href="/client/my-cases"
          className="flex items-center gap-1 text-accent font-normal text-sm"
        >
          {t("viewAllCases")}
          <MoveRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>

      <CasesTable cases={cases.slice(0, 5)} />
    </div>
  );
}
