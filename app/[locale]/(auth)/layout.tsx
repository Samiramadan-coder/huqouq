import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    return redirect("/");
  }
  return (
    <main className="min-h-screen py-5 flex items-center justify-center">
      <div className="container max-w-7xl flex justify-center">{children}</div>
    </main>
  );
}
