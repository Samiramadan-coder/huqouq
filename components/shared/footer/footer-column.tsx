export default function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <div className="flex flex-col items-start gap-5">{children}</div>
    </div>
  );
}

export function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.08em] text-white">
      {children}
    </h3>
  );
}
