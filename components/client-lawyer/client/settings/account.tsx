"use client";

import NormalElementControl from "./normal-element-control";

export default function Account() {
  return (
    <div>
      <h2 className="ltr:font-lora text-[15px] text-primary tracking-wide mb-4">
        Account
      </h2>

      <div className="bg-white px-5 border border-secondary rounded-[5px] divide-y divide-secondary">
        <div className="py-4"></div>

        <NormalElementControl type="text" field="name" label="Full Name" />

        <NormalElementControl type="email" field="email" label="Email" />

        <NormalElementControl type="tel" field="phone" label="Phone" />

        <div className="py-4"></div>
      </div>
    </div>
  );
}
