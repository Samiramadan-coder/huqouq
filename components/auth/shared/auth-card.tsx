import { Card, CardContent } from "@/components/ui/card";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="ring-0! rounded-[10px] shadow-[0_2px_32px_rgba(27,58,87,0.08)] px-8 md:px-10 py-10 w-full sm:w-115">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
