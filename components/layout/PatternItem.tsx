import type { Pattern } from "@/lib/game-of-life";
import { cn } from "@/lib/utils";

type PatternItemProps = {
  pattern: Pattern;
  onSelect: () => void;
};

export const PatternItem = ({ pattern, onSelect }: PatternItemProps) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg",
        "hover:bg-accent/50 transition-colors duration-150",
        "focus:outline-none focus:ring-1 focus:ring-ring",
        "group",
      )}
    >
      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {pattern.name}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{pattern.description}</div>
    </button>
  );
};
