import SubmitBtn from "@/components/public/shared/form/submit-btn";

export default function ProfessionalInfo() {
  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="sm:col-span-2 flex justify-end">
        <SubmitBtn
          label="SaveSection"
          loading={false}
          showArrow={false}
          className="w-auto h-9 px-5"
        />
      </div>
    </form>
  );
}
