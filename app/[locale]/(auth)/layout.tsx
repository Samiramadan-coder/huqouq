import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    return redirect({ href: "/", locale: await getLocale() });
  }
  return (
    <main className="min-h-screen py-5 flex items-center justify-center">
      <div className="container max-w-7xl flex justify-center">{children}</div>
    </main>
  );
}
