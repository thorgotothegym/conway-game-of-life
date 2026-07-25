"use client";

import type { MouseEventHandler } from "react";
import { memo, useCallback, useRef, useState } from "react";

import type { Grid } from "@/lib/game-of-life";

import { Cell } from "./Cell";

type SimulationGridProps = {
  grid: Grid;
  onCellToggle: (row: number, col: number) => void;
  cellSize?: number;
  isRunning: boolean;
};

type GridRef = { current: Grid };
type BooleanRef = { current: boolean };
type StringRef = { current: string | null };

type InteractionRefs = {
  gridRef: GridRef;
  isDraggingRef: BooleanRef;
  dragValueRef: BooleanRef;
  lastCellRef: StringRef;
};

const parseCellCoordinates = (dataset: DOMStringMap) => {
  const row = Number(dataset.row);
  const col = Number(dataset.column);

  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    return null;
  }

  return { row, col };
};

const getCellAliveValue = (grid: Grid, row: number, col: number) => {
  if (row < 0 || row >= grid.length) return null;
  const gridRow = grid[row];
  if (col < 0 || col >= gridRow.length) return null;
  return gridRow[col];
};

export const handleCellMouseDownFromDataset = (
  dataset: DOMStringMap,
  refs: InteractionRefs,
  onCellToggle: (row: number, col: number) => void,
) => {
  const coords = parseCellCoordinates(dataset);
  if (!coords) return;

  const { row, col } = coords;
  const currentAlive = getCellAliveValue(refs.gridRef.current, row, col);
  if (currentAlive === null) return;

  const nextValue = !currentAlive;

  refs.isDraggingRef.current = true;
  refs.dragValueRef.current = nextValue;
  refs.lastCellRef.current = `${row}-${col}`;

  onCellToggle(row, col);
};

export const handleCellMouseEnterFromDataset = (
  dataset: DOMStringMap,
  refs: InteractionRefs,
  onCellToggle: (row: number, col: number) => void,
) => {
  if (!refs.isDraggingRef.current) return;

  const coords = parseCellCoordinates(dataset);
  if (!coords) return;

  const { row, col } = coords;
  const cellKey = `${row}-${col}`;

  if (cellKey === refs.lastCellRef.current) return;
  refs.lastCellRef.current = cellKey;

  const currentAlive = getCellAliveValue(refs.gridRef.current, row, col);
  if (currentAlive === null) return;

  const shouldBeAlive = refs.dragValueRef.current;
  if (currentAlive !== shouldBeAlive) {
    onCellToggle(row, col);
  }
};

export const stopCellDrag = (refs: Pick<InteractionRefs, "isDraggingRef" | "lastCellRef">) => {
  refs.isDraggingRef.current = false;
  refs.lastCellRef.current = null;
};

export const SimulationGrid = memo(function SimulationGrid({
  grid,
  onCellToggle,
  cellSize = 12,
  isRunning,
}: SimulationGridProps) {
  const [_, setDragValue] = useState(true);
  const gridRef = useRef(grid);
  const isDraggingRef = useRef(false);
  const dragValueRef = useRef(true);
  const lastCellRef = useRef<string | null>(null);

  gridRef.current = grid;

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      handleCellMouseDownFromDataset(
        event.currentTarget.dataset,
        {
          gridRef,
          isDraggingRef,
          dragValueRef,
          lastCellRef,
        },
        onCellToggle,
      );
      setDragValue(dragValueRef.current);
    },
    [onCellToggle],
  );

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      handleCellMouseEnterFromDataset(
        event.currentTarget.dataset,
        {
          gridRef,
          isDraggingRef,
          dragValueRef,
          lastCellRef,
        },
        onCellToggle,
      );
    },
    [onCellToggle],
  );

  const handleMouseUp = useCallback(() => {
    stopCellDrag({ isDraggingRef, lastCellRef });
  }, []);

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div
      data-running={isRunning ? "true" : "false"}
      className="relative rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl data-[running=true]:[&_div.cell-alive]:shadow-none"
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
              row={rowIndex}
              column={colIndex}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
            />
          )),
        )}
      </div>
    </div>
  );
});
