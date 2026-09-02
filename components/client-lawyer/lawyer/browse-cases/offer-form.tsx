"use client";

import FormInput from "@/components/public/shared/form/form-input";
import FormSelect from "@/components/public/shared/form/form-select";
import FormTextarea from "@/components/public/shared/form/form-textarea";
import SubmitBtn from "@/components/public/shared/form/submit-btn";
import { useForm } from "react-hook-form";

export default function OfferForm() {
  const { register, control } = useForm<{ name: string }>();

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormInput
        required
        register={register}
        name="name"
        type="number"
        label="Proposed Price (AED)"
        placeholder="e.g., 5000"
        inputClassName="bg-background border border-accent/20!"
      />

      <FormSelect
        control={control}
        required
        name="name"
        label="Estimated Timeline"
        placeholder="Select estimated timeline"
        triggerClassName="bg-background border border-accent/20!"
        options={[]}
      />

      <FormTextarea
        register={register}
        required
        name="name"
        label="Proposal Message"
        placeholder="Introduce yourself, explain your relevant experience, and outline how you would handle this specific case. Personalised proposals convert significantly better."
        className="sm:col-span-2"
        textareaClassName="bg-background border border-accent/20!"
        description="Minimum 20 characters · 0 typed"
      />

      <div className="sm:col-span-2 flex justify-end">
        <SubmitBtn label="Submit Offer" loading={false} className="w-40 h-10" />
      </div>
    </form>
  );
}
