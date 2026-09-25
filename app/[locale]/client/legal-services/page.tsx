import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { LegalService } from "@/types/client/legal-services";
import ListOfServices from "@/components/client-lawyer/client/legal-services/list-of-services";
import SectionTitle from "@/components/client-lawyer/client/legal-services/section-title";

export default async function Page() {
  const { data, ok } = await http.get<{
    data: LegalService[];
    meta: Meta;
  }>("/api/legal-services");

  if (!ok) {
    throw new Error("Failed to fetch legal services");
  }

  console.log(data);
  return (
    <div className="py-10 container max-w-5xl space-y-6">
      <SectionTitle />
      <ListOfServices services={data.data} pagination={data.meta} />
    </div>
  );
}
