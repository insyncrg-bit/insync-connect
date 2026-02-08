import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
}: SelectFieldProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className || "bg-white/5 border-white/10 text-white"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
