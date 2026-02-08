import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const FormField = ({ label, required, error, children, className }: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

interface TextInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

export const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  className,
}: TextInputProps) => {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20",
        className
      )}
    />
  );
};

interface TextAreaInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
}

export const TextAreaInput = ({
  id,
  value,
  onChange,
  placeholder,
  minHeight = "120px",
  disabled,
  className,
}: TextAreaInputProps) => {
  return (
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{ minHeight }}
      className={cn(
        "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20",
        className
      )}
    />
  );
};
