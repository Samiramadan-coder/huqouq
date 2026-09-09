"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Proposal({ message }: { message: string }) {
  const t = useTranslations("Client.Cases");
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <>
      <p
        className={`text-xs text-primary/70 whitespace-normal wrap-break-word leading-relaxed ${
          showFullMessage ? "" : "line-clamp-2"
        }`}
        onClick={() => setShowFullMessage(!showFullMessage)}
      >
        {message || "_"}
      </p>
      <button
        type="button"
        className="mt-1 text-[11px] cursor-pointer text-accent hover:underline font-normal"
        onClick={() => setShowFullMessage(!showFullMessage)}
      >
        {showFullMessage ? t("readLess") : t("readMore")}
      </button>
    </>
  );
}
