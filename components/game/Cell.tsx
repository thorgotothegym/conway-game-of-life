import { memo } from "react";

import { cn } from "@/lib/utils";

type CellProps = {
  alive: boolean;
  size: number;
  onMouseDown: () => void;
  onMouseEnter: () => void;
};

export const CellComponent = ({ alive, size, onMouseDown, onMouseEnter }: CellProps) => {
  return (
    <div
      className={cn(
        `
        transition-all duration-75 cursor-pointer select-none
        ${alive ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-card hover:bg-accent/50"}
      `,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    />
  );
};

export const Cell = memo(CellComponent);
