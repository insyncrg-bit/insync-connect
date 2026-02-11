import { ReactNode } from "react";

interface DashboardLayoutProps {
  loading?: boolean;
  children: ReactNode;
}

export function DashboardLayout({ loading, children }: DashboardLayoutProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151a24]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--cyan-glow))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#151a24]">
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
