import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export const VCAdminSettings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Configure your firm settings and preferences</p>
      </div>
      <Card className="bg-[#151a24] border-white/10 p-8 text-center">
        <SettingsIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Settings Coming Soon</h2>
        <p className="text-white/60">Settings functionality will be implemented in a future update.</p>
      </Card>
    </div>
  );
};
