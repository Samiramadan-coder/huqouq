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

import { cn, formatChatDate } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Search, ShieldCheck } from "lucide-react";
import { useUser } from "@/providers/user-provider";
import { doc, onSnapshot } from "firebase/firestore";
import { CaseDetails } from "@/types/lawyer/my-cases";
import { ensureFirebaseAuth } from "@/features/chat";

export default function ChatMembers({
  cases,
  caseId,
}: {
  cases: CaseDetails[];
  caseId: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Lawyer.Messages");

  const [firebaseReady, setFirebaseReady] = useState(false);

  const fontClass = locale === "en" ? "font-lora" : "";

  useEffect(() => {
    const initFirebase = async () => {
      try {
        await ensureFirebaseAuth();

        setFirebaseReady(true);
      } catch (error) {
        console.error("Firebase auth init error:", error);
      }
    };

    initFirebase();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-secondary px-4 pt-5 pb-3">
        <h1
          className={`${fontClass} mb-3 text-[17px] font-semibold text-primary`}
        >
          {t("Title")}
        </h1>

        <InputGroup className="h-9 rounded-sm border-secondary bg-background">
          <InputGroupInput
            placeholder={t("SearchPlaceholder")}
            className="placeholder:text-xs placeholder:text-primary/35"
          />

          <InputGroupAddon>
            <Search className="size-3 text-primary/35" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex-1 overflow-y-auto">
        {firebaseReady &&
          cases.map((caseItem) => (
            <ChatMember key={caseItem.id} caseItem={caseItem} caseId={caseId} />
          ))}
      </div>
    </div>
  );
}

function ChatMember({
  caseItem,
  caseId,
}: {
  caseItem: CaseDetails;
  caseId: string;
}) {
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
    if (!caseItem.id || !user?.id) {
      return;
    }

    const chatRef = doc(db, "chats", String(caseItem.id));

    const unsubscribe = onSnapshot(
      chatRef,

      (snapshot) => {
        if (!snapshot.exists()) {
          setChatMeta({
            lastMessage: null,
            lastMessageAt: null,
            lastMessageSenderId: null,
            isUnread: false,
          });

          return;
        }

        const data = snapshot.data();

        const lastMessageAt = data.lastMessageAt?.toDate?.() ?? null;

        const myLastRead = data.lastRead?.[String(user.id)]?.toDate?.() ?? null;

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
        console.error(`Chat listener error for case ${caseItem.id}:`, error);
      },
    );

    return unsubscribe;
  }, [caseItem.id, user?.id]);

  return (
    <button
      type="button"
      onClick={() => {
        router.push(`/lawyer/messages?caseId=${caseItem.id}`);
      }}
      className={cn(
        "flex w-full items-center gap-3 border-b border-secondary px-4 py-3 text-start transition-colors last:border-b-0 hover:bg-gray-50",

        String(caseId) === String(caseItem.id) ? "bg-gray-100" : "",
      )}
    >
      <Avatar className="size-11 shrink-0">
        <AvatarImage
          src={caseItem.client.photo_url || "/avatar.png"}
          alt={caseItem.client.name}
        />

        <AvatarFallback className="bg-primary text-xs font-semibold text-white">
          {caseItem.client.name.slice(0, 2)}
        </AvatarFallback>

        <AvatarBadge className="bg-accent">
          <ShieldCheck />
        </AvatarBadge>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-primary">
            {caseItem.client.name}
          </p>

          <span className="shrink-0 text-[11px] text-primary/50">
            {chatMeta.lastMessageAt && formatChatDate(chatMeta.lastMessageAt)}
          </span>
        </div>

        <p className="mt-0.5 truncate text-[11px] text-accent">
          {caseItem.title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <p
            className={cn(
              "min-w-0 flex-1 truncate text-xs",

              chatMeta.isUnread
                ? "font-semibold text-primary"
                : "text-primary/50",
            )}
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
