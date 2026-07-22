export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen grid place-content-center py-5">
      {children}
    </main>
  );
}
