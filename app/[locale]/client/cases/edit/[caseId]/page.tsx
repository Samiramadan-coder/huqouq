import Form from "@/components/client-lawyer/client/cases/form";
import { http } from "@/lib/http";
import { CaseDetails } from "@/types/client/cases";

type Params = {
  caseId: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { caseId } = await params;

  const { data, ok } = await http.get<{ data: CaseDetails }>(
    `/api/cases/${caseId}`,
  );

  if (!ok) {
    throw new Error("Failed to fetch case details");
  }

  return <Form caseItem={data.data} />;
}
