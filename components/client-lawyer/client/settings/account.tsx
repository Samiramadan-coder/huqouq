import ChangingPassword from "./changing-password";
import NormalElementControl from "./normal-element-control";
import ProfilePhoto from "./profile-photo";
import { getTranslations } from "next-intl/server";

export default async function Account() {
  const t = await getTranslations("Client.Settings.Account");

  return (
    <div>
      <h2 className="ltr:font-lora text-[15px] text-primary tracking-wide mb-4">
        {t("title")}
      </h2>

      <div className="bg-white px-5 border border-secondary rounded-[5px] divide-y divide-secondary">
        <ProfilePhoto />

        <NormalElementControl type="text" field="name" label={t("fullName")} />

        <NormalElementControl type="email" field="email" label={t("email")} />

        <NormalElementControl
          type="tel"
          field="phone"
          label={t("phone")}
          subtitle={t("phoneHint")}
        />

        <ChangingPassword />
      </div>
    </div>
  );
}
