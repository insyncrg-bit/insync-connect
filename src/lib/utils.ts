import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STAGE_COLORS: Record<string, string> = {
  "Pre-seed": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Seed": "bg-green-500/20 text-green-400 border-green-500/30",
  "Series A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Series B": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export function getStageColor(stage: string): string {
  return STAGE_COLORS[stage] || "bg-white/10 text-white/80 border-white/20";
}
