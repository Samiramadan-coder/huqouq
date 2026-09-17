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
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  ArrowUp,
  CheckCheck,
  FileText,
  Paperclip,
  ShieldCheck,
} from "lucide-react";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import { subscribeToMessages } from "@/features/chat";
import { formatTime } from "@/lib/utils";

export default function Messages({
  caseId,
  myUserId,
}: {
  caseId?: string;
  myUserId: string;
}) {
  const t = useTranslations("Client.Messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!caseId || !myUserId) return;

    const unsubscribe = subscribeToMessages(
      String(caseId),
      String(myUserId),
      (messages) => {
        setMessages(messages);
      },
      (error) => {
        console.error("Messages error:", error);
      },
    );

    return unsubscribe;
  }, [caseId, myUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-secondary bg-white px-5 py-3.5">
        <Avatar className="size-9 shrink-0">
          <AvatarImage
            src="https://i.pravatar.cc/150?img=12"
            alt="Ahmad Al Rashidi"
          />
          <AvatarFallback className="bg-primary text-xs font-semibold text-white">
            A
          </AvatarFallback>
          <AvatarBadge className="bg-accent">
            <ShieldCheck />
          </AvatarBadge>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary">
            Ahmad Al Rashidi
            <Badge className="ms-2 border-accent/40 bg-white text-[10px] text-accent">
              {t("Verified")}
            </Badge>
          </p>

          <span className="block truncate text-[11px] text-primary/50">
            Tenancy Agreement Review
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-5">
            {messages.map((message) => {
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

                  {/* Bubble wrapper */}
                  <div
                    className={
                      message.sentByUser
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={[
                        "max-w-[70%] rounded-md px-4 py-3 text-sm leading-5",
                        message.sentByUser
                          ? "bg-primary text-white"
                          : "border border-secondary bg-white text-primary",
                      ].join(" ")}
                    >
                      {/* Text message */}
                      {message.type === "text" && (
                        <p className="whitespace-pre-wrap wrap-break-word">
                          {message.text}
                        </p>
                      )}

                      {/* Image */}
                      {message.type === "file" &&
                        message.fileType?.startsWith("image/") &&
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

                      {/* Other files */}
                      {message.type === "file" &&
                        !message.fileType?.startsWith("image/") &&
                        message.fileUrl && (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex max-w-72 items-center gap-2"
                          >
                            <FileText className="size-4 shrink-0" />

                            <span className="truncate">
                              {message.fileName || "File"}
                            </span>
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom area */}
        <div className="shrink-0 space-y-3 px-5 py-4">
          <Card className="flex-row items-center justify-between gap-4 rounded-xs border border-secondary px-4 py-2.5 ring-0!">
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <CheckCheck className="size-3 text-accent" />
              <span className="text-xs text-primary/70">{t("IsResolved")}</span>
            </p>
            <Button
              variant="outline"
              className="rounded-sm border-secondary bg-white text-[11px] font-medium text-accent"
            >
              {t("MarkAsComplete")}
            </Button>
          </Card>

          {/* Message input */}
          <InputGroup className="h-12 rounded-xs border-secondary bg-white">
            <InputGroupInput
              placeholder={t("WriteAMessage")}
              className="text-sm placeholder:text-xs placeholder:text-primary/50"
            />

            <InputGroupAddon align="inline-end">
              <InputGroupButton type="button" size="icon-xs">
                <Paperclip className="text-primary/50" />
              </InputGroupButton>

              <InputGroupButton
                type="button"
                size="icon-sm"
                className="size-7 rounded-full bg-primary/40 text-white hover:bg-primary/60 disabled:opacity-100"
              >
                <ArrowUp />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
