"use client";

import { memo, useCallback, useRef, useState } from "react";

import type { Grid } from "@/lib/game-of-life";

import { Cell } from "./Cell";

type SimulationGridProps = {
  grid: Grid;
  onCellToggle: (row: number, col: number) => void;
  cellSize?: number;
};

export const SimulationGrid = memo(function SimulationGrid({
  grid,
  onCellToggle,
  cellSize = 12,
}: SimulationGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [_, setDragValue] = useState(true);
  const lastCellRef = useRef<string | null>(null);

  const handleCellInteraction = useCallback(
    (row: number, col: number, isNewDrag: boolean = false) => {
      const cellKey = `${row}-${col}`;
      if (!isNewDrag && cellKey === lastCellRef.current) return;

      lastCellRef.current = cellKey;
      onCellToggle(row, col);
    },
    [onCellToggle],
  );

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      setIsDragging(true);
      setDragValue(!grid[row][col]);
      handleCellInteraction(row, col, true);
    },
    [grid, handleCellInteraction],
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isDragging) {
        handleCellInteraction(row, col);
      }
    },
    [isDragging, handleCellInteraction],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    lastCellRef.current = null;
  }, []);

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div
        className="grid gap-px p-2 relative"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          backgroundColor: "var(--grid-line)",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              alive={cell}
              size={cellSize}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            />
          )),
        )}
      </div>
    </div>
  );
});
