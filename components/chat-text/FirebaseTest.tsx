"use client";

import { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function FirebaseTest() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    let unsubscribeMessages: (() => void) | undefined;

    const testFirebase = async () => {
      try {
        if (!auth.currentUser) {
          const result = await signInAnonymously(auth);

          console.log("Firebase UID:", result.user.uid);
        }

        const caseId = "23";

        const messagesRef = collection(db, "chats", caseId, "messages");

        const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

        unsubscribeMessages = onSnapshot(
          messagesQuery,
          (snapshot) => {
            console.log("Messages count:", snapshot.size);

            snapshot.forEach((doc) => {
              console.log("Message:", doc.id, doc.data());
            });

            setStatus("Chat messages connected");
          },
          (error) => {
            console.error("Messages listener error:", error);

            setStatus("Failed to read messages");
          },
        );
      } catch (error) {
        console.error("Firebase test error:", error);

        setStatus("Firebase connection failed");
      }
    };

    testFirebase();

    return () => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, []);

  return <div>{status}</div>;
}
