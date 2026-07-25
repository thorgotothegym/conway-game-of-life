import { describe, expect, it, vi } from "vitest";

import type { Grid } from "../../lib/game-of-life";

vi.mock("@/lib/utils", async () => import("../../lib/utils"));

const { handleCellMouseDownFromDataset, handleCellMouseEnterFromDataset, stopCellDrag } =
  await import("../../components/game/SimulationGrid");

const createGrid = (rows: number, cols: number, alive: Array<[number, number]> = []): Grid => {
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
  alive.forEach(([row, col]) => {
    grid[row][col] = true;
  });
  return grid;
};

const datasetFor = (row: number, col: number): DOMStringMap =>
  ({ row: String(row), column: String(col) }) as unknown as DOMStringMap;

const createInteractionHarness = (initialGrid: Grid) => {
  const refs = {
    gridRef: { current: initialGrid },
    isDraggingRef: { current: false },
    dragValueRef: { current: true },
    lastCellRef: { current: null as string | null },
  };

  const calls: Array<[number, number]> = [];

  const onCellToggle = (row: number, col: number) => {
    calls.push([row, col]);

    const nextGrid = refs.gridRef.current.map((gridRow) => [...gridRow]);
    nextGrid[row][col] = !nextGrid[row][col];
    refs.gridRef.current = nextGrid;
  };

  return { refs, calls, onCellToggle };
};

describe("SimulationGrid shared interaction handlers", () => {
  it("mouse-down toggles the selected cell and starts drag state", () => {
    const { refs, calls, onCellToggle } = createInteractionHarness(createGrid(2, 2));

    handleCellMouseDownFromDataset(datasetFor(0, 1), refs, onCellToggle);

    expect(calls).toEqual([[0, 1]]);
    expect(refs.isDraggingRef.current).toBe(true);
    expect(refs.dragValueRef.current).toBe(true);
    expect(refs.lastCellRef.current).toBe("0-1");
    expect(refs.gridRef.current[0][1]).toBe(true);
  });

  it("drag painting sets dead cells alive but does not toggle already alive cells", () => {
    const { refs, calls, onCellToggle } = createInteractionHarness(createGrid(1, 4, [[0, 3]]));

    handleCellMouseDownFromDataset(datasetFor(0, 0), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 1), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 3), refs, onCellToggle);

    expect(calls).toEqual([
      [0, 0],
      [0, 1],
    ]);
    expect(refs.gridRef.current[0][0]).toBe(true);
    expect(refs.gridRef.current[0][1]).toBe(true);
    expect(refs.gridRef.current[0][3]).toBe(true);
  });

  it("drag erasing sets alive cells dead but leaves dead cells unchanged", () => {
    const { refs, calls, onCellToggle } = createInteractionHarness(
      createGrid(1, 4, [
        [0, 0],
        [0, 1],
      ]),
    );

    handleCellMouseDownFromDataset(datasetFor(0, 0), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 1), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 2), refs, onCellToggle);

    expect(calls).toEqual([
      [0, 0],
      [0, 1],
    ]);
    expect(refs.dragValueRef.current).toBe(false);
    expect(refs.gridRef.current[0][0]).toBe(false);
    expect(refs.gridRef.current[0][1]).toBe(false);
    expect(refs.gridRef.current[0][2]).toBe(false);
  });

  it("repeated mouse-enter on the same cell does not retoggle", () => {
    const { refs, calls, onCellToggle } = createInteractionHarness(createGrid(1, 3));

    handleCellMouseDownFromDataset(datasetFor(0, 0), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 1), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 1), refs, onCellToggle);

    expect(calls).toEqual([
      [0, 0],
      [0, 1],
    ]);
  });

  it("uses current grid ref after grid replacement", () => {
    const { refs, calls, onCellToggle } = createInteractionHarness(createGrid(2, 2));

    handleCellMouseDownFromDataset(datasetFor(0, 0), refs, onCellToggle);

    refs.gridRef.current = createGrid(2, 2, [[1, 1]]);
    refs.lastCellRef.current = "0-0";

    handleCellMouseEnterFromDataset(datasetFor(1, 1), refs, onCellToggle);

    expect(calls).toEqual([[0, 0]]);
  });

  it("handles board resize by ignoring out-of-bounds coordinates while keeping in-bounds interaction", () => {
    const { refs, calls, onCellToggle } = createInteractionHarness(createGrid(2, 2));

    handleCellMouseDownFromDataset(datasetFor(0, 0), refs, onCellToggle);

    refs.gridRef.current = createGrid(1, 1);
    refs.lastCellRef.current = "0-0";

    handleCellMouseEnterFromDataset(datasetFor(5, 5), refs, onCellToggle);
    handleCellMouseEnterFromDataset(datasetFor(0, 0), refs, onCellToggle);

    stopCellDrag(refs);

    expect(calls).toEqual([
      [0, 0],
      [0, 0],
    ]);
    expect(refs.isDraggingRef.current).toBe(false);
    expect(refs.lastCellRef.current).toBe(null);
  });
});
