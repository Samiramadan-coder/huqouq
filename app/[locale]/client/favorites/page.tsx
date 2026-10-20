import { http } from "@/lib/http";
import { Lawyer } from "@/types/client/find-lawyer";
import LawyerCard from "@/components/client-lawyer/client/find-lawyer/lawyer-card";

export default async function Page() {
  const { data } = await http.get<{
    data: Lawyer[];
    count: number;
  }>("/api/lawyers/favorites");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="font-serif text-2xl text-primary">
        Favorites <span>({data.count})</span>
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.data.map((lawyer, index) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} index={index} />
        ))}
      </div>
    </div>
  );
}
