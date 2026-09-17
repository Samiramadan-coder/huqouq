import { http } from "@/lib/http";
import { Case } from "@/types/client/my-cases";
import Messages from "@/components/client-lawyer/lawyer/messages/messages";
import ChatMembers from "@/components/client-lawyer/lawyer/messages/chat-members";
import { CaseDetails } from "@/types/lawyer/my-cases";

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
    data: CaseDetails[];
  }>("/api/lawyer/my-cases");

  if (!ok) {
    throw new Error("Failed to fetch cases");
  }

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <aside className="w-75 h-full bg-white border-e border-secondary">
        <ChatMembers
          cases={data.data.filter((caseItem) => caseItem.chat_unlocked)}
          caseId={caseId}
        />
      </aside>

      <div className="flex-1 h-full">
        <Messages
          caseId={caseId}
          activeCase={data.data.find((caseItem) => caseItem.id === +caseId)}
        />
      </div>
    </div>
  );
}
