import { HankoProfile } from "@/features/auth/components/hanko-profile.tsx";

export function SettingsPage() {
  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>
      <HankoProfile />
    </div>
  );
}
