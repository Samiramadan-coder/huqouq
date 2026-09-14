import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ChatMembers() {
  const conversations = [
    {
      id: 1,
      name: "Ahmad Al Rashidi",
      avatar: "https://i.pravatar.cc/150?img=12",
      time: "10:42 AM",
      subject: "Employment Contract Dispute",
      message: "I have reviewed the documents...",
      unreadCount: 2,
      online: true,
    },
    {
      id: 2,
      name: "Sara Khalil",
      avatar: "https://i.pravatar.cc/150?img=47",
      time: "9:30 AM",
      subject: "Family Law Consultation",
      message: "Thank you for your response...",
      unreadCount: 0,
      online: false,
    },
    {
      id: 3,
      name: "Mohammed Al Farsi",
      avatar: "https://i.pravatar.cc/150?img=68",
      time: "Yesterday",
      subject: "Property Dispute",
      message: "Can we schedule a meeting?",
      unreadCount: 4,
      online: true,
    },
  ];

  const locale = await getLocale();
  const t = await getTranslations("Client.Messages");
  const fontClass = locale === "en" ? "font-lora" : "";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-5 pb-3 border-b border-secondary">
        <h1
          className={`${fontClass} font-semibold text-[17px] text-primary mb-3`}
        >
          {t("Title")}
        </h1>

        <InputGroup className="bg-background border-secondary rounded-sm h-9">
          <InputGroupInput
            placeholder={t("SearchPlaceholder")}
            className="placeholder:text-primary/35 placeholder:text-xs"
          />
          <InputGroupAddon>
            <Search className="text-primary/35 size-3" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            className="flex w-full items-center gap-3 border-b border-secondary px-4 py-3 text-start transition-colors last:border-b-0 hover:bg-gray-50"
          >
            <Avatar className="size-11 shrink-0">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                {conversation.name.slice(0, 2)}
              </AvatarFallback>
              <AvatarBadge className="bg-accent">
                <ShieldCheck />
              </AvatarBadge>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-primary">
                  {conversation.name}
                </p>

                <span className="shrink-0 text-[11px] text-primary/50">
                  {conversation.time}
                </span>
              </div>

              <p className="mt-0.5 truncate text-[11px] text-accent">
                {conversation.subject}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-xs text-primary/50">
                  {conversation.message}
                </p>

                {conversation.unreadCount > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
