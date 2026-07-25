import { describe, expect, it, vi } from "vitest";

import type { Grid } from "../../lib/game-of-life";
import { createEmptyGrid, nextGeneration } from "../../lib/game-of-life";

vi.mock("@/lib/game-of-life", async () => import("../../lib/game-of-life"));

const { getOrComputeNextGrid } = await import("../../hooks/useGameOfLife");

describe("useGameOfLife next-generation cache helper", () => {
  it("returns the same cached next-grid reference for the same grid identity", () => {
    const cache = new WeakMap<Grid, Grid>();
    const grid = createEmptyGrid(3, 3);

    const first = getOrComputeNextGrid(cache, grid);
    const second = getOrComputeNextGrid(cache, grid);

    expect(second).toBe(first);
  });

  it("does not recompute for the same grid identity", () => {
    const cache = new WeakMap<Grid, Grid>();
    const grid = createEmptyGrid(4, 4);
    const computeSpy = vi.fn((currentGrid: Grid) => nextGeneration(currentGrid));

    getOrComputeNextGrid(cache, grid, computeSpy);
    getOrComputeNextGrid(cache, grid, computeSpy);

    expect(computeSpy).toHaveBeenCalledTimes(1);
  });

  it("computes again for a new grid object identity", () => {
    const cache = new WeakMap<Grid, Grid>();
    const firstGrid = createEmptyGrid(5, 5);
    const secondGrid = createEmptyGrid(5, 5);
    const computeSpy = vi.fn((currentGrid: Grid) => nextGeneration(currentGrid));

    const first = getOrComputeNextGrid(cache, firstGrid, computeSpy);
    const second = getOrComputeNextGrid(cache, secondGrid, computeSpy);

    expect(computeSpy).toHaveBeenCalledTimes(2);
    expect(second).not.toBe(first);
  });
});
