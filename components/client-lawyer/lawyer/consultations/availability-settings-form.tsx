import SubmitBtn from "@/components/public/shared/form/submit-btn";

export default function AvailabilitySettingsForm() {
  return (
    <form className="space-y-6">
      <BlockCard title="Consultation Settings">
        <div>-</div>
      </BlockCard>

      <BlockCard title="Weekly Recurring Availability">
        <div>-</div>
      </BlockCard>

      <BlockCard title="Blocked Dates (Exceptions)">
        <div>-</div>
      </BlockCard>

      <SubmitBtn
        label="Save Availability"
        loading={false}
        className="bg-accent w-auto px-6"
      />
    </form>
  );
}

function BlockCard({
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
