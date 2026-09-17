import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Card } from "@/components/ui/card";
import { db, storage } from "@/lib/firebase";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useUser } from "@/providers/user-provider";
import { ArrowUp, CheckCheck, Paperclip } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ensureFirebaseAuth, sendTextMessage } from "@/features/chat";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import CloseCase from "../cases/details/close-case";
import { Case } from "@/types/client/my-cases";

export default function SendMessage({
  caseId,
  activeCase,
}: {
  caseId: string;
  activeCase: Case | undefined;
}) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const t = useTranslations("Client.Messages");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const canSend =
    (!!message.trim() || !!selectedFile) && !sending && !!caseId && !!user?.id;

  const handleOpenFiles = () => {
    if (sending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error("Unsupported file type:", file.type);

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
    event.target.value = "";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    if (!canSend) return;

    const text = message.trim();

    try {
      setSending(true);

      if (selectedFile) {
        await sendFileMessage({
          caseId: String(caseId),
          userId: String(user?.id),
          file: selectedFile,
          text,
        });
      } else if (text) {
        await sendTextMessage({
          caseId: String(caseId),
          userId: String(user?.id),
          text,
        });
      }

      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="shrink-0 space-y-3 px-5 py-4">
      {activeCase?.can_close && (
        <Card className="flex-row items-center justify-between gap-4 rounded-xs border border-secondary px-4 py-2.5 ring-0!">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCheck className="size-3 text-accent" />
            <span className="text-xs text-primary/70">{t("IsResolved")}</span>
          </p>

          <CloseCase caseId={+caseId} />
        </Card>
      )}

      {selectedFile && (
        <div className="flex items-center justify-between rounded-sm border border-secondary bg-white px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Paperclip className="size-4 shrink-0 text-accent" />

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-primary">
                {selectedFile.name}
              </p>

              <p className="text-[10px] text-primary/40">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={sending}
            className="shrink-0 text-xs text-primary/50 hover:text-primary"
          >
            ×
          </button>
        </div>
      )}

      {!activeCase?.can_close &&
        activeCase?.display_status !== "pending_closure" &&
        activeCase?.display_status !== "closed" && (
          <InputGroup className="h-12 rounded-xs border-secondary bg-white">
            <InputGroupInput
              value={message}
              disabled={sending}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  handleSend();
                }
              }}
              placeholder={sending ? "Sending..." : t("WriteAMessage")}
              className="text-sm placeholder:text-xs placeholder:text-primary/50"
            />

            <InputGroupAddon align="inline-end">
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={[
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/gif",
                  ".pdf",
                  ".doc",
                  ".docx",
                ].join(",")}
                onChange={handleFileChange}
              />

              <InputGroupButton
                type="button"
                size="icon-xs"
                disabled={sending}
                onClick={handleOpenFiles}
              >
                <Paperclip
                  className={selectedFile ? "text-accent" : "text-primary/50"}
                />
              </InputGroupButton>

              <InputGroupButton
                type="button"
                size="icon-sm"
                disabled={!canSend}
                onClick={handleSend}
                className={[
                  "size-7 rounded-full text-white disabled:opacity-100",
                  canSend ? "bg-primary hover:bg-primary/90" : "bg-primary/40",
                ].join(" ")}
              >
                <ArrowUp />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        )}
    </div>
  );
}

// Function to send a file message in the chat
async function sendFileMessage({
  caseId,
  userId,
  file,
  text = "",
  caseTitle = null,
}: {
  caseId: string;
  userId: string;
  file: File;
  text?: string;
  caseTitle?: string | null;
}) {
  await ensureFirebaseAuth();

  const chatRef = doc(db, "chats", String(caseId));

  const messagesRef = collection(chatRef, "messages");

  const messageRef = doc(messagesRef);

  const messageId = messageRef.id;

  const storagePath = `chat-attachments/${caseId}/${messageId}_${file.name}`;

  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file);

  const fileUrl = await getDownloadURL(fileRef);

  const cleanText = text.trim();

  await setDoc(messageRef, {
    senderId: String(userId),

    type: "file",

    text: cleanText || null,

    fileUrl,

    fileName: file.name,

    fileType: file.type || "application/octet-stream",

    fileSizeBytes: file.size || null,

    createdAt: serverTimestamp(),
  });

  await setDoc(
    chatRef,
    {
      caseId: String(caseId),

      caseTitle: caseTitle ?? null,

      lastMessage:
        cleanText || (file.type.startsWith("image/") ? "Photo" : "File"),

      lastMessageAt: serverTimestamp(),

      lastMessageSenderId: String(userId),
    },
    {
      merge: true,
    },
  );
}
