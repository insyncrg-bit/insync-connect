import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const SwitchField = ({ label, description, checked, onChange, className }: SwitchFieldProps) => (
  <div className={`flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg ${className || ""}`}>
    <div>
      <Label className="text-white/80">{label}</Label>
      {description && <p className="text-white/60 text-sm">{description}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);
