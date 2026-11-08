import type { Metadata } from "next";
import NotificationsPage, {
  generateNotificationsMetadata,
} from "@/components/client-lawyer/shared/notifications/notifications-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateNotificationsMetadata();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  return <NotificationsPage page={page} />;
}
