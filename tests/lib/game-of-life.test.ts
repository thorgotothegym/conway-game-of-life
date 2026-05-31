import { describe, expect, it } from "vitest";

import { countNeighbors, type Grid, nextGeneration } from "../../lib/game-of-life";

const gridFromRows = (rows: string[]): Grid =>
  rows.map((row) => row.split("").map((cell) => cell === "#"));

describe("game of life logic", () => {
  describe("countNeighbors", () => {
    it("should count neighbours for a center cell", () => {
      const grid = gridFromRows(["#.#", ".#.", "..."]);

      expect(countNeighbors(grid, 1, 1)).toBe(2);
    });

    it("should ignore out-of-bounds neighbours at board edges", () => {
      const grid = gridFromRows(["#..", ".#.", "..#"]);

      expect(countNeighbors(grid, 0, 0)).toBe(1);
    });
  });

  describe("conway base rules", () => {
    it("should kill a live cell with fewer than 2 neighbours", () => {
      const current = gridFromRows(["...", ".#.", "..."]);

      const next = nextGeneration(current);

      expect(next[1][1]).toBe(false);
    });

    it("should keep a live cell alive with 2 neighbours", () => {
      const current = gridFromRows([".#.", "##.", "..."]);

      const next = nextGeneration(current);

      expect(next[1][1]).toBe(true);
    });

    it("should kill a live cell with more than 3 neighbours", () => {
      const current = gridFromRows(["###", "##.", "..."]);

      const next = nextGeneration(current);

      expect(next[1][1]).toBe(false);
    });

    it("should revive a dead cell with exactly 3 neighbours", () => {
      const current = gridFromRows(["###", "...", "..."]);

      const next = nextGeneration(current);

      expect(next[1][1]).toBe(true);
    });
  });

  describe("finite board edges", () => {
    it("should not wrap neighbours across opposite board sides", () => {
      const current = gridFromRows(["#.#", "...", ".#."]);

      const next = nextGeneration(current);

      expect(next[0][1]).toBe(false);
    });
  });

  describe("known patterns", () => {
    it("should keep a block pattern stable across generations", () => {
      const initial = gridFromRows(["....", ".##.", ".##.", "...."]);

      const next = nextGeneration(initial);
      const nextAgain = nextGeneration(next);

      expect(next).toEqual(initial);
      expect(nextAgain).toEqual(initial);
    });

    it("should oscillate a blinker every generation", () => {
      const horizontal = gridFromRows([".....", ".....", ".###.", ".....", "....."]);
      const vertical = gridFromRows([".....", "..#..", "..#..", "..#..", "....."]);

      const afterOne = nextGeneration(horizontal);
      const afterTwo = nextGeneration(afterOne);

      expect(afterOne).toEqual(vertical);
      expect(afterTwo).toEqual(horizontal);
    });
  });
});
