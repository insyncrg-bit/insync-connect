import { ArrowRight } from "lucide-react";

interface CuratedSectionProps {
  title: string;
  onViewAll?: () => void;
  children: React.ReactNode;
}

export function CuratedSection({ title, onViewAll, children }: CuratedSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">{title}</h2>
        {onViewAll && (
          <button
            className="text-sm text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1"
            onClick={onViewAll}
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
