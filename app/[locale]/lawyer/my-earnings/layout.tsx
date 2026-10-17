import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import React from "react";

export default function MyEarningsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-5xl py-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Title>My Earnings</Title>
          <Hint>Earnings from Legal Services and Consultations.</Hint>
        </div>
      </div>

      {children}
    </div>
  );
}
