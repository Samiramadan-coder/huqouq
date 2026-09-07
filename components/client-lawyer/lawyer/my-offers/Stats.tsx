import { Card } from "@/components/ui/card";
import { Counts } from "@/types/lawyer/my-offers";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";

export default async function Stats({ counts }: { counts: Counts }) {
  const t = await getTranslations("Lawyer.MyOffers");

  return (
    <Card
      className="rounded-sm border border-secondary px-4 flex-row flex-wrap"
      style={{ boxShadow: "none" }}
    >
      <StatItem count={counts.all} label={t("TotalOffers")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.pending} label={t("pending")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.pending_fees} label={t("pending_fees")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.in_progress} label={t("in_progress")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.cancelled} label={t("cancelled")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.closed} label={t("closed")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.accepted} label={t("accepted")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.accepted} label={t("accepted")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.declined} label={t("declined")} />
      <Separator orientation="vertical" className="bg-secondary" />

      <StatItem count={counts.withdrawn} label={t("withdrawn")} />
    </Card>
  );
}

function StatItem({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="font-bold text-lg text-primary">{count}</span>
      <span className="font-normal text-xs text-primary/40">{label}</span>
    </div>
  );
}
