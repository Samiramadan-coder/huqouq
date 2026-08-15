"use client";

import SubmitBtn from "@/components/public/shared/form/submit-btn";

export default function SendForReview() {
  return (
    <div className="flex justify-end">
      <SubmitBtn
        className="min-w-40 w-auto h-11"
        label="Sent For Review"
        loading={false}
      />
    </div>
  );
}
