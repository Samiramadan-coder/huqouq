"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "@/components/shared/form/form-input";
import FormSelect from "@/components/shared/form/form-select";
import SubmitBtn from "@/components/shared/form/submit-btn";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/icons/logo";

import type { GuestType } from "@/types/shared";

export default function SignUpForm({ guestType }: { guestType: GuestType }) {
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
    terms: boolean;
  }>();

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="sm:col-span-2 flex flex-col items-center gap-4">
        <Logo />
        <p className="text-xs text-foreground">
          Signing up as a{" "}
          <span className="text-secondary">
            {guestType === "client" ? "Client" : "Lawyer"}
          </span>{" "}
          <span>·</span>{" "}
          <Link href="/get-started" className="text-secondary">
            Change
          </Link>{" "}
        </p>
        <h1 className="font-lora text-[1.6rem] font-bold text-primary text-center mb-1">
          Create Your Account
        </h1>
      </div>

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
        label="City / Emirates"
        control={control}
        options={[
          { label: "Emirates ID 1", value: "eid1" },
          { label: "Emirates ID 2", value: "eid2" },
        ]}
        className="sm:col-span-2"
        required
      />

      <div className="sm:col-span-2">
        <Controller
          name="terms"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="size-4 rounded-[3px] border-border data-[state=checked]:border-secondary data-[state=checked]:bg-secondary"
              />

              <Label
                htmlFor="terms"
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                I agree to the
                <Link
                  href="/terms-of-use"
                  className="text-secondary hover:underline"
                >
                  Terms of Use
                </Link>
                and
                <Link
                  href="/privacy-policy"
                  className="text-secondary hover:underline"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <SubmitBtn label="Create Account" loading={false} />
      </div>
    </form>
  );
}
