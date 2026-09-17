import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import type { ChatMessage, SendTextMessageParams } from "@/types/chat";

export async function ensureFirebaseAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const result = await signInAnonymously(auth);

  return result.user;
}

export function subscribeToMessages(
  caseId: string,
  currentUserId: string,
  onMessages: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void,
) {
  const messagesRef = collection(db, "chats", String(caseId), "messages");

  const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(
    messagesQuery,

    (snapshot) => {
      const messages: ChatMessage[] = snapshot.docs.map((document) => {
        const data = document.data();

        return {
          id: document.id,

          senderId: String(data.senderId ?? ""),

          type: data.type ?? "text",

          text: data.text ?? null,

          fileName: data.fileName ?? null,

          fileType: data.fileType ?? null,

          fileUrl: data.fileUrl ?? null,

          fileSizeBytes: data.fileSizeBytes ?? null,

          replyTo: data.replyTo ?? null,

          createdAt: data.createdAt?.toDate?.() ?? null,

          sentByUser: String(data.senderId) === String(currentUserId),
        };
      });

      onMessages(messages);
    },

    (error) => {
      console.error("Messages listener error:", error);

      onError?.(error);
    },
  );
}

export async function sendTextMessage({
  caseId,
  userId,
  text,
  caseTitle = null,
  replyTo = null,
}: SendTextMessageParams) {
  const cleanText = text.trim();

  if (!cleanText) {
    return;
  }

  await ensureFirebaseAuth();

  const chatRef = doc(db, "chats", String(caseId));

  const messagesRef = collection(chatRef, "messages");

  await addDoc(messagesRef, {
    senderId: String(userId),

    type: "text",

    text: cleanText,

    fileName: null,
    fileType: null,
    fileUrl: null,

    replyTo,

    createdAt: serverTimestamp(),
  });

  await setDoc(
    chatRef,
    {
      caseId: String(caseId),

      caseTitle: caseTitle ?? null,

      lastMessage: cleanText,

      lastMessageAt: serverTimestamp(),

      lastMessageSenderId: String(userId),
    },
    {
      merge: true,
    },
  );
}

export async function markChatAsRead(caseId: string, userId: string) {
  await ensureFirebaseAuth();

  const chatRef = doc(db, "chats", String(caseId));

  await setDoc(
    chatRef,
    {
      lastRead: {
        [String(userId)]: serverTimestamp(),
      },
    },
    {
      merge: true,
    },
  );
}
