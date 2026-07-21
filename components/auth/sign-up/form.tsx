"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "@/components/shared/form/form-input";
import FormSelect from "@/components/shared/form/form-select";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<{
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password: string;
    password_confirmation: string;
    emirates_id: string;
  }>();

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <FormInput
        name="first_name"
        placeholder="Sami"
        label="First Name"
        register={register}
        required
        errors={errors}
      />

      <FormInput
        name="last_name"
        placeholder="Ramadan"
        label="Last Name"
        register={register}
        required
        errors={errors}
      />

      <FormInput
        name="phone"
        placeholder="50 123 4567"
        label="Phone"
        className="sm:col-span-2"
        prefix="+971"
        register={register}
        required
        errors={errors}
      />

      <FormInput
        name="email"
        placeholder="your@example.com"
        label="Email"
        className="sm:col-span-2"
        register={register}
        required
        errors={errors}
      />

      <FormInput
        name="password"
        placeholder="Create a strong password"
        label="Password"
        type={showPassword ? "text" : "password"}
        className="sm:col-span-2"
        register={register}
        required
        errors={errors}
        suffix={
          showPassword ? (
            <Eye
              className="cursor-pointer size-5"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeOff
              className="cursor-pointer size-5"
              onClick={() => setShowPassword(true)}
            />
          )
        }
      />

      <FormInput
        name="password_confirmation"
        placeholder="Confirm your password"
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        className="sm:col-span-2"
        register={register}
        required
        errors={errors}
        suffix={
          showPassword ? (
            <Eye
              className="cursor-pointer size-5"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeOff
              className="cursor-pointer size-5"
              onClick={() => setShowPassword(true)}
            />
          )
        }
      />

      <FormSelect
        name="emirates_id"
        label="Emirates ID"
        control={control}
        options={[
          { label: "Emirates ID 1", value: "eid1" },
          { label: "Emirates ID 2", value: "eid2" },
        ]}
        className="sm:col-span-2"
        required
      />
    </form>
  );
}
