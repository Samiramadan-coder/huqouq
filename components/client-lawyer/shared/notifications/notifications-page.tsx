import { getTranslations } from "next-intl/server";
import NotificationsList from "./notifications-list";
import Hint from "@/components/client-lawyer/reusable/hint";
import Title from "@/components/client-lawyer/reusable/title";
import { getNotifications } from "@/lib/shared/notifications";

// Shared by /client/notifications and /lawyer/notifications; the role comes
// from the NotificationsProvider in each layout
export default async function NotificationsPage({ page }: { page?: string }) {
  const t = await getTranslations("Notifications");
  const data = await getNotifications(Number(page) || 1);

  console.log(data);

  return (
    <div className="container py-10 max-w-4xl space-y-6">
      <div>
        <Title>{t("Title")}</Title>
        <Hint>{t("Subtitle")}</Hint>
      </div>

      {data ? (
        <NotificationsList notifications={data.data} pagination={data.meta} />
      ) : (
        <p className="py-16 text-center text-sm text-primary/40">
          {t("LoadError")}
        </p>
      )}
    </div>
  );
}

export async function generateNotificationsMetadata() {
  const t = await getTranslations("Notifications");

  return {
    title: `${t("Title")} | Huqouq`,
    robots: { index: false, follow: false },
  };
}
