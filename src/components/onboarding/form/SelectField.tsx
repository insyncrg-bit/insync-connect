import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const SelectField = ({ value, onChange, options, placeholder = "Select an option", className }: SelectFieldProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={className || "bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]"}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-white border border-[hsl(var(--navy-deep))]/10">
      {options.map((option) => (
        <SelectItem key={option} value={option} className="text-[hsl(var(--navy-deep))]">
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
