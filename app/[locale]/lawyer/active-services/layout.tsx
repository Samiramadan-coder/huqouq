export default function ActiveServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container py-10 space-y-6">{children}</div>;
}
