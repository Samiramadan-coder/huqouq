import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/lawyer/my-cases";
import Messages from "@/components/client-lawyer/lawyer/messages/messages";
import ChatMembers from "@/components/client-lawyer/lawyer/messages/chat-members";

type SearchParams = {
  caseId: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Lawyer.Messages");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { caseId } = await searchParams;

  const { data, ok } = await http.get<{
    data: CaseDetails[];
  }>("/api/lawyer/my-cases", {
    next: {
      tags: ["lawyer-my-cases"],
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch cases");
  }

  return (
    <div className="flex h-[calc(100dvh-56px)]">
      {/* On mobile only one pane is visible: the list, or the open chat */}
      <aside
        className={cn(
          "w-full md:w-75 shrink-0 h-full bg-white md:border-e border-secondary",
          caseId && "hidden md:block",
        )}
      >
        <ChatMembers
          cases={data.data.filter((caseItem) => caseItem.chat_unlocked)}
          caseId={caseId}
        />
      </aside>

      <div
        className={cn("flex-1 min-w-0 h-full", !caseId && "hidden md:block")}
      >
        <Messages
          caseId={caseId}
          activeCase={data.data.find((caseItem) => caseItem.id === +caseId)}
        />
      </div>
    </div>
  );
}
