"use client";

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

import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Case } from "@/types/client/my-cases";
import { Search, ShieldCheck } from "lucide-react";
import { useUser } from "@/providers/user-provider";
import { doc, onSnapshot } from "firebase/firestore";
import { ensureFirebaseAuth } from "@/features/chat";

export default function ChatMembers({
  cases,
  caseId,
}: {
  cases: Case[];
  caseId: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Client.Messages");
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
        {cases.map((caseItem) => (
          <ChatMember key={caseItem.id} caseItem={caseItem} caseId={caseId} />
        ))}
      </div>
    </div>
  );
}

// ChatMember component represents an individual chat member in the chat members list.
function ChatMember({ caseItem, caseId }: { caseItem: Case; caseId: string }) {
  const { user } = useUser();
  const router = useRouter();

  const [chatMeta, setChatMeta] = useState<{
    lastMessage: string | null;
    lastMessageAt: Date | null;
    lastMessageSenderId: string | null;
    isUnread: boolean;
  }>({
    lastMessage: null,
    lastMessageAt: null,
    lastMessageSenderId: null,
    isUnread: false,
  });

  useEffect(() => {
    if (!caseItem.id || !user?.id) return;

    let unsubscribe: (() => void) | undefined;

    const startListener = async () => {
      try {
        await ensureFirebaseAuth();

        const chatRef = doc(db, "chats", String(caseItem.id));

        unsubscribe = onSnapshot(
          chatRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              return;
            }

            const data = snapshot.data();

            const lastMessageAt = data.lastMessageAt?.toDate?.() ?? null;

            const myLastRead =
              data.lastRead?.[String(user.id)]?.toDate?.() ?? null;

            const isUnread =
              !!data.lastMessageSenderId &&
              String(data.lastMessageSenderId) !== String(user.id) &&
              (!myLastRead || (lastMessageAt && lastMessageAt > myLastRead));

            setChatMeta({
              lastMessage: data.lastMessage ?? null,

              lastMessageAt,

              lastMessageSenderId:
                data.lastMessageSenderId != null
                  ? String(data.lastMessageSenderId)
                  : null,

              isUnread: Boolean(isUnread),
            });
          },
          (error) => {
            console.error("Chat listener error:", error);
          },
        );
      } catch (error) {
        console.error("Firebase auth error:", error);
      }
    };

    startListener();

    return () => {
      unsubscribe?.();
    };
  }, [caseItem.id, user?.id]);

  return (
    <button
      onClick={() => {
        router.push(`/client/messages?caseId=${caseItem.id}`);
      }}
      type="button"
      className={cn(
        "flex w-full items-center gap-3 border-b border-secondary px-4 py-3 text-start transition-colors last:border-b-0 hover:bg-gray-50",
        +caseId === caseItem.id ? "bg-gray-100" : "",
      )}
    >
      <Avatar className="size-11 shrink-0">
        <AvatarImage
          src={caseItem.hired_lawyer.photo_url || "/avatar.png"}
          alt={caseItem.hired_lawyer.name}
        />

        <AvatarFallback className="bg-primary text-xs font-semibold text-white">
          {caseItem.hired_lawyer.name.slice(0, 2)}
        </AvatarFallback>

        <AvatarBadge className="bg-accent">
          <ShieldCheck />
        </AvatarBadge>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-primary">
            {caseItem.hired_lawyer.name}
          </p>

          <span className="shrink-0 text-[11px] text-primary/50">
            {chatMeta.lastMessageAt &&
              chatMeta.lastMessageAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>
        </div>

        <p className="mt-0.5 truncate text-[11px] text-accent">
          {caseItem.title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <p
            className={`min-w-0 flex-1 truncate text-xs ${
              chatMeta.isUnread
                ? "font-semibold text-primary"
                : "text-primary/50"
            }`}
          >
            {chatMeta.lastMessage || "No messages yet"}
          </p>

          {chatMeta.isUnread && (
            <span className="size-2 shrink-0 rounded-full bg-accent" />
          )}
        </div>
      </div>
    </button>
  );
}
