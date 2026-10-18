import { http } from "@/lib/http";
import { cn } from "@/lib/utils";
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
    <div className="flex h-[calc(100dvh-56px)]">
      {/* On mobile only one pane is visible: the list, or the open chat */}
      <aside
        className={cn(
          "w-full md:w-75 shrink-0 h-full bg-white md:border-e border-secondary",
          caseId && "hidden md:block",
        )}
      >
        <ChatMembers cases={availableCases} caseId={caseId} />
      </aside>

      <div
        className={cn("flex-1 min-w-0 h-full", !caseId && "hidden md:block")}
      >
        <Messages caseId={caseId} activeCase={activeCase} />
      </div>
    </div>
  );
}
