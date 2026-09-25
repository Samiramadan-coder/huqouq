import { http } from "@/lib/http";
import Form from "@/components/client-lawyer/client/legal-services/form";
import { LegalServiceDetails } from "@/types/client/legal-services";

type Params = {
  serviceId: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { serviceId } = await params;

  const { data, ok } = await http.get<{ data: LegalServiceDetails }>(
    `/api/legal-services/${serviceId}`,
  );

  if (!ok) {
    throw new Error("Failed to fetch case details");
  }

  return <Form legalServiceItem={data.data} />;
}
