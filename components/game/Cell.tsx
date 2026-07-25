import type { MouseEventHandler } from "react";
import { memo } from "react";

import { cn } from "@/lib/utils";

type CellProps = {
  alive: boolean;
  size: number;
  row: number;
  column: number;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
};

export const CellComponent = ({
  alive,
  size,
  row,
  column,
  onMouseDown,
  onMouseEnter,
}: CellProps) => {
  return (
    <div
      data-row={row}
      data-column={column}
      className={cn(
        `
        transition-colors duration-75 cursor-pointer select-none
        ${alive ? "cell-alive bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-card hover:bg-accent/50"}
      `,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    />
  );
};

export const Cell = memo(CellComponent);
