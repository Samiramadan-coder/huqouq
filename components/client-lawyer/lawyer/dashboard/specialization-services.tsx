import SubmitBtn from "@/components/public/shared/form/submit-btn";

export default function SpecializationServices() {
  return (
    <form className="grid grid-cols-1 gap-6">
      <div className="flex justify-end">
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
