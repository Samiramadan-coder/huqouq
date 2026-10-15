import AddNew from "@/components/client-lawyer/reusable/add-new";
import Title from "@/components/client-lawyer/reusable/title";

export default function MyConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-5xl py-10 space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <Title>My Consultations</Title>
        <AddNew href="/client/find-lawyers">Book a New Consultation</AddNew>
      </div>

      {children}
    </div>
  );
}
