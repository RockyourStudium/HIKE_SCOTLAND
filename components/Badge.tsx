import type { Difficulty } from "@/data/types";

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-fog text-forest-dark",
  Moderate: "bg-mint text-forest-darkest",
  Challenging: "bg-mist text-forest-darkest",
  Expert: "bg-forest-dark text-fog",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[level]}`}
    >
      {level}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-softgray/70 bg-white px-3 py-1 text-xs font-medium text-neutralgray">
      {children}
    </span>
  );
}
