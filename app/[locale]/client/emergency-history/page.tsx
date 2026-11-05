import { http } from "@/lib/http";
import { Meta } from "@/types/shared";
import { Emergency } from "@/types/client/emergency";
import DataPreview from "@/components/client-lawyer/client/emergency/data-preview";

export default async function Page() {
  const { data } = await http.get<{
    data: Emergency[];
    meta: Meta;
  }>("/api/emergency/requests", {
    next: {
      tags: ["emergencies"],
    },
  });

  console.log(data);

  return (
    <div className="container py-10 max-w-7xl">
      <DataPreview emergency={data.data} pagination={data.meta} />
    </div>
  );
}
