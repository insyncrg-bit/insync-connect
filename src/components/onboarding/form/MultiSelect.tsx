import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  maxHeight?: string;
}

export const MultiSelect = ({ options, selected, onChange, className, maxHeight = "auto" }: MultiSelectProps) => {
  const toggleOption = (option: string) => {
    const updated = selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option];
    onChange(updated);
  };
  return (
    <div className={cn("flex flex-wrap gap-2", className)} style={{ maxHeight, overflowY: maxHeight !== "auto" ? "auto" : "visible" }}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => toggleOption(option)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm transition-all",
            selected.includes(option) ? "bg-cyan-glow text-navy-deep" : "bg-white/5 text-white/60 hover:bg-white/10"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
