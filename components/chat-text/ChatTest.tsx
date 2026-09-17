"use client";

import { sendTextMessage, subscribeToMessages } from "@/features/chat";
import { ChatMessage } from "@/types/chat";
import { useEffect, useState } from "react";

export default function ChatTest() {
  const caseId = "23";

  // مؤقت فقط للاختبار
  // حط هنا Laravel User ID بتاعك
  const userId = "39";

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToMessages(caseId, userId, setMessages);

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendTextMessage({
      caseId,
      userId,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="p-6">
      <div className="space-y-2">
        {messages.map((item) => (
          <div key={item.id}>
            <strong>{item.senderId}</strong>

            {" - "}

            {item.text}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="border p-2"
          placeholder="Message"
        />

        <button onClick={handleSend} className="border px-4">
          Send
        </button>
      </div>
    </div>
  );
}
