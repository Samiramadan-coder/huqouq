import { http } from "@/lib/http";

export default async function Page() {
  const { data } = await http.get("/api/notifications");
  console.log(data);
  return <div>My Notifications</div>;
}
