"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import Image from "next/image";
import { formatTime } from "@/lib/utils";
import SendMessage from "./send-message";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CaseDetails } from "@/types/lawyer/my-cases";
import type { ChatMessage } from "@/types/chat";
import { useUser } from "@/providers/user-provider";
import { useEffect, useRef, useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { subscribeToMessages } from "@/features/chat";

export default function Messages({
  caseId,
  activeCase,
}: {
  caseId: string;
  activeCase: CaseDetails | undefined;
}) {
  const { user } = useUser();
  const t = useTranslations("Lawyer.Messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!caseId || !user?.id) return;

    const unsubscribe = subscribeToMessages(
      String(caseId),
      String(user?.id),
      (messages) => {
        setMessages(messages);
      },
      (error) => {
        console.error("Messages error:", error);
      },
    );

    return unsubscribe;
  }, [caseId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {caseId ? (
        <>
          <div className="flex shrink-0 items-center gap-3 border-b border-secondary bg-white px-5 py-3.5">
            <Avatar className="size-9 shrink-0">
              <AvatarImage
                src={activeCase?.client.photo_url || "/avatar.png"}
                alt={activeCase?.client.name || "Avatar"}
              />
              <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                {activeCase?.client.name.slice(0, 2) || "A"}
              </AvatarFallback>
              <AvatarBadge className="bg-accent">
                <ShieldCheck />
              </AvatarBadge>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary">
                {activeCase?.client.name || "Unknown"}
                <Badge className="ms-2 border-accent/40 bg-white text-[10px] text-accent">
                  {t("Verified")}
                </Badge>
              </p>

              <span className="block truncate text-[11px] text-primary/50">
                {activeCase?.title || "No case title"}
              </span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-5">
                {messages.map((message) => {
                  const isFile = message.type === "file";

                  if (message.type === "system") {
                    return (
                      <div key={message.id} className="flex justify-center">
                        <div className="rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-[11px] text-accent">
                          {message.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="flex flex-col">
                      <span className="mb-2 text-center text-[10px] text-primary/30">
                        {formatTime(message.createdAt)}
                      </span>

                      <div
                        className={
                          message.sentByUser
                            ? "flex justify-end"
                            : "flex justify-start"
                        }
                      >
                        <div
                          className={[
                            "max-w-[70%] rounded-md text-sm leading-5",
                            !isFile && "px-4 py-3",
                            !isFile &&
                              (message.sentByUser
                                ? "bg-primary text-white"
                                : "border border-secondary bg-white text-primary"),
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {message.type === "text" && message.text && (
                            <p className="whitespace-pre-wrap wrap-break-word">
                              {message.text}
                            </p>
                          )}

                          {message.type === "file" && (
                            <div className="space-y-2">
                              {message.fileType?.startsWith("image/") &&
                                message.fileUrl && (
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <Image
                                      src={message.fileUrl}
                                      alt={message.fileName || "Attachment"}
                                      width={320}
                                      height={288}
                                      className="max-h-72 max-w-80 rounded-md object-cover"
                                    />
                                  </a>
                                )}

                              {!message.fileType?.startsWith("image/") &&
                                message.fileUrl && (
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={[
                                      "flex max-w-72 items-center gap-2 rounded-md border px-3 py-2",
                                      message.sentByUser
                                        ? "border-primary/20 bg-primary text-white"
                                        : "border-secondary bg-white text-primary",
                                    ].join(" ")}
                                  >
                                    <FileText className="size-4 shrink-0" />

                                    <span className="truncate">
                                      {message.fileName || "File"}
                                    </span>
                                  </a>
                                )}

                              {message.text && (
                                <div
                                  className={[
                                    "w-fit max-w-72 rounded-md px-4 py-3",
                                    message.sentByUser
                                      ? "ms-auto bg-primary text-white"
                                      : "border border-secondary bg-white text-primary",
                                  ].join(" ")}
                                >
                                  <p className="whitespace-pre-wrap wrap-break-word">
                                    {message.text}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <SendMessage caseId={caseId} />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-primary/50">{t("SelectCase")}</p>
        </div>
      )}
    </div>
  );
}
