import PersonalInfo from "@/components/client-lawyer/client/profile/personal-info";
import UpdateProfile from "@/components/client-lawyer/client/profile/update-profile";

export default function Page() {
  return (
    <div className="space-y-6 mx-auto max-w-3xl py-8">
      <PersonalInfo />
      <UpdateProfile />
    </div>
  );
}
