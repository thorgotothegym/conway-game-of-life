"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Grid, Pattern } from "@/lib/game-of-life";
import {
  countAliveCells,
  createEmptyGrid,
  createRandomGrid,
  nextGeneration,
  placePattern,
} from "@/lib/game-of-life";

type UseGameOfLifeOptions = {
  initialRows?: number;
  initialCols?: number;
};

type SimulationStatus = "idle" | "running" | "paused" | "stable" | "empty" | "boundary-reached";

const gridsEqual = (firstGrid: Grid, secondGrid: Grid) => {
  if (firstGrid.length !== secondGrid.length) return false;
  if (firstGrid[0]?.length !== secondGrid[0]?.length) return false;

  for (let row = 0; row < firstGrid.length; row++) {
    for (let col = 0; col < firstGrid[row].length; col++) {
      if (firstGrid[row][col] !== secondGrid[row][col]) return false;
    }
  }

  return true;
};

const hasLiveCellsOnEdge = (grid: Grid) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isEdgeCell = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
      if (isEdgeCell && grid[row][col]) return true;
    }
  }

  return false;
};

const getSimulationStatusMessage = (status: SimulationStatus) => {
  switch (status) {
    case "stable":
      return "Stable pattern detected.";
    case "empty":
      return "No live cells remaining.";
    case "boundary-reached":
      return "Pattern reached the board boundary.";
    case "running":
      return "Running";
    case "paused":
      return "Paused";
    case "idle":
    default:
      return "Idle";
  }
};

export function useGameOfLife({ initialRows = 50, initialCols = 70 }: UseGameOfLifeOptions = {}) {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(initialRows, initialCols));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(100); // ms between generations
  const [gridSize, setGridSize] = useState({
    rows: initialRows,
    cols: initialCols,
  });
  const [fps, setFps] = useState(0);

  const runningRef = useRef(isRunning);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  runningRef.current = isRunning;

  const aliveCells = countAliveCells(grid);
  const nextGrid = useMemo(() => nextGeneration(grid), [grid]);
  const simulationStatus = useMemo<SimulationStatus>(() => {
    if (aliveCells === 0) return "empty";
    if (hasLiveCellsOnEdge(grid)) return "boundary-reached";
    if (gridsEqual(grid, nextGrid)) return "stable";
    if (isRunning) return "running";
    if (generation === 0) return "idle";
    return "paused";
  }, [aliveCells, generation, grid, isRunning, nextGrid]);
  const simulationStatusMessage = getSimulationStatusMessage(simulationStatus);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    frameCountRef.current++;
    const now = performance.now();
    if (now - lastTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    setGrid((g) => nextGeneration(g));
    setGeneration((g) => g + 1);

    setTimeout(runSimulation, speed);
  }, [speed]);

  useEffect(() => {
    if (isRunning) {
      runSimulation();
    }
  }, [isRunning, runSimulation]);

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid((g) => {
      const newGrid = g.map((r) => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  }, []);

  const clear = useCallback(() => {
    setGrid(createEmptyGrid(gridSize.rows, gridSize.cols));
    setGeneration(0);
    setIsRunning(false);
  }, [gridSize]);

  const randomize = useCallback(() => {
    setGrid(createRandomGrid(gridSize.rows, gridSize.cols));
    setGeneration(0);
  }, [gridSize]);

  const step = useCallback(() => {
    setGrid((g) => nextGeneration(g));
    setGeneration((g) => g + 1);
  }, []);

  const play = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((r) => !r), []);

  const updateGridSize = useCallback((rows: number, cols: number) => {
    setGridSize({ rows, cols });
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
    setIsRunning(false);
  }, []);

  const addPattern = useCallback(
    (pattern: Pattern, row?: number, col?: number) => {
      const startRow = row ?? Math.floor(gridSize.rows / 2 - 5);
      const startCol = col ?? Math.floor(gridSize.cols / 2 - 5);
      setGrid((g) => placePattern(g, pattern, startRow, startCol));
    },
    [gridSize],
  );

  const totalCells = gridSize.rows * gridSize.cols;
  const density = ((aliveCells / totalCells) * 100).toFixed(1);

  return {
    grid,
    setGrid,
    isRunning,
    generation,
    speed,
    setSpeed,
    gridSize,
    fps,
    aliveCells,
    totalCells,
    density,
    simulationStatus,
    simulationStatusMessage,
    toggleCell,
    clear,
    randomize,
    step,
    play,
    pause,
    toggle,
    updateGridSize,
    addPattern,
  };
}
