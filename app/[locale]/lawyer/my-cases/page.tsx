import { http } from "@/lib/http";

export default async function Page() {
  const { data, ok } = await http.get("/api/lawyer/my-cases");

  if (!ok) {
    throw new Error("Failed to fetch my cases");
  }

  console.log(data);
  return <div>My Cases</div>;
}
