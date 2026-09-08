import { Badge } from "@/components/ui/badge";

// CaseStatus and CasesTable components are defined below,
export default function CaseStatusLabel({
  status,
  statusLabel,
}: {
  status: string;
  statusLabel: string;
}) {
  switch (status) {
    case "pending_review":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {statusLabel}
        </Badge>
      );

    case "pending_closure":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {statusLabel}
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-blue-50 border-blue-100 text-blue-700">
          {statusLabel}
        </Badge>
      );

    case "published":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {statusLabel}
        </Badge>
      );

    case "pending_fees":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {statusLabel}
        </Badge>
      );

    case "has_offers":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-green-100 border-green-300 text-green-700">
          {statusLabel}
        </Badge>
      );

    case "hired":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-accent/10 border-accent/25 text-accent">
          {statusLabel}
        </Badge>
      );

    case "closed":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {statusLabel}
        </Badge>
      );

    case "rejected":
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-destructive/10 border-destructive/15 text-destructive">
          {statusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="rounded-sm text-[11px] h-6.5 font-normal bg-primary/5 border-primary/20 text-primary">
          {statusLabel}
        </Badge>
      );
  }
}
