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

import { signInWithCustomToken, signOut, type User } from "firebase/auth";

import { auth, db } from "@/lib/firebase";
import { getFirebaseToken } from "@/lib/auth";

import type { ChatMessage, SendTextMessageParams } from "@/types/chat";

type FirebaseSession = {
  user: User;
  // The `userId` claim from the custom token. Firestore rules require
  // message senderId to equal it, type included.
  senderId: string | number;
};

let pendingSignIn: {
  userId: string;
  promise: Promise<FirebaseSession>;
} | null = null;

async function readSession(user: User): Promise<FirebaseSession | null> {
  const { claims } = await user.getIdTokenResult();
  const senderId = claims.userId;

  return typeof senderId === "string" || typeof senderId === "number"
    ? { user, senderId }
    : null;
}

// Sign in to Firebase as the given app user with a custom token from the API.
// Reuses the persisted session when it already belongs to that user.
export async function ensureFirebaseAuth(
  userId: string | number,
): Promise<FirebaseSession> {
  const appUserId = String(userId);

  await auth.authStateReady();

  if (auth.currentUser) {
    const session = await readSession(auth.currentUser);

    if (session && String(session.senderId) === appUserId) {
      return session;
    }
  }

  if (pendingSignIn?.userId === appUserId) {
    return pendingSignIn.promise;
  }

  const promise = getFirebaseToken()
    .then((token) => signInWithCustomToken(auth, token))
    .then(async ({ user }) => {
      const session = await readSession(user);

      if (!session || String(session.senderId) !== appUserId) {
        throw new Error("Firebase token does not match the logged-in user");
      }

      return session;
    })
    .finally(() => {
      if (pendingSignIn?.promise === promise) {
        pendingSignIn = null;
      }
    });

  pendingSignIn = { userId: appUserId, promise };

  return promise;
}

export async function signOutOfFirebase() {
  pendingSignIn = null;

  await signOut(auth).catch((error) =>
    console.error("Error signing out of Firebase", error),
  );
}

export function subscribeToMessages(
  caseId: string,
  currentUserId: string,
  onMessages: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void,
) {
  let unsubscribeFirestore: (() => void) | null = null;

  let cancelled = false;

  const startListener = async () => {
    try {
      await ensureFirebaseAuth(currentUserId);

      if (cancelled) {
        return;
      }

      const messagesRef = collection(db, "chats", String(caseId), "messages");

      const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

      unsubscribeFirestore = onSnapshot(
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
          console.error(`Messages listener error for case ${caseId}:`, error);

          onError?.(error);
        },
      );
    } catch (error) {
      console.error("Firebase authentication error:", error);

      onError?.(
        error instanceof Error
          ? error
          : new Error("Firebase authentication failed"),
      );
    }
  };

  startListener();

  return () => {
    cancelled = true;

    if (unsubscribeFirestore) {
      unsubscribeFirestore();
    }
  };
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

  const { senderId } = await ensureFirebaseAuth(userId);

  const chatRef = doc(db, "chats", String(caseId));

  const messagesRef = collection(chatRef, "messages");

  await addDoc(messagesRef, {
    senderId,

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

      lastMessageSenderId: senderId,
    },
    {
      merge: true,
    },
  );
}

export async function markChatAsRead(caseId: string, userId: string) {
  await ensureFirebaseAuth(userId);

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
