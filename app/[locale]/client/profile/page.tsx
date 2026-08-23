import QuickLinks from "@/components/client-lawyer/client/profile/quick-links";
import PersonalInfo from "@/components/client-lawyer/client/profile/personal-info";
import UpdateProfile from "@/components/client-lawyer/client/profile/update-profile";

export default function Page() {
  return (
    <div className="space-y-6 container max-w-3xl">
      <PersonalInfo />
      <UpdateProfile />
      <QuickLinks />
    </div>
  );
}
