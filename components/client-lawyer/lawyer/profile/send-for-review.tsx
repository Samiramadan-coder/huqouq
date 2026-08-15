"use client";

import { useState } from "react";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { sendForReview } from "@/lib/lawyer/dashboard";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function SendForReview() {
  const t = useTranslations("Lawyer.Dashboard");
  const [loading, setLoading] = useState(false);

  async function handleSendForReview() {
    setLoading(true);
    const result = await sendForReview();
    setLoading(false);

    if (result.success) {
      toast.success("Profile sent for review successfully");
      return;
    }

    toast.error("Failed to send profile for review");
  }
  return (
    <form
      className="flex justify-end"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendForReview();
      }}
    >
      <SubmitBtn
        className="min-w-40 w-auto h-11 bg-secondary hover:bg-secondary"
        label={t("SubmitForReview")}
        loading={loading}
      />
    </form>
  );
}
