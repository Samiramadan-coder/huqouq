import { http } from "@/lib/http";
import { Case } from "@/types/client/my-cases";
import Messages from "@/components/client-lawyer/client/messages/messages";
import ChatMembers from "@/components/client-lawyer/client/messages/chat-members";

type SearchParams = {
  caseId: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { caseId } = await searchParams;

  const { data, ok } = await http.get<{
    data: Case[];
  }>("/api/cases");

  if (!ok) {
    throw new Error("Failed to fetch cases");
  }

  const activeCase = data.data.find((caseItem) => caseItem.id === +caseId);
  const availableCases = data.data.filter((caseItem) => caseItem.chat_unlocked);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <aside className="w-75 h-full bg-white border-e border-secondary">
        <ChatMembers cases={availableCases} caseId={caseId} />
      </aside>

      <div className="flex-1 h-full">
        <Messages caseId={caseId} activeCase={activeCase} />
      </div>
    </div>
  );
}
