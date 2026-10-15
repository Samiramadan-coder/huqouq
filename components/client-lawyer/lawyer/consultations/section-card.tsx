export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-secondary">
      <div className="px-5 py-4 border-b border-secondary">
        <p className="text-xs uppercase font-semibold text-primary/40 tracking-[0.08em]">
          {title}
        </p>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
