import Messages from "@/components/client-lawyer/client/messages/messages";
import ChatMembers from "@/components/client-lawyer/client/messages/chat-members";

export default function Page() {
  return (
    <div className="flex h-[calc(100vh-56px)]">
      <aside className="w-75 h-full bg-white border-e border-secondary">
        <ChatMembers />
      </aside>

      <div className="flex-1 h-full">
        <Messages />
      </div>
    </div>
  );
}
