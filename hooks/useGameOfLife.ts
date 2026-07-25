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

export const getOrComputeNextGrid = (
  cache: WeakMap<Grid, Grid>,
  currentGrid: Grid,
  computeNextGrid: (grid: Grid) => Grid = nextGeneration,
) => {
  const cached = cache.get(currentGrid);
  if (cached) return cached;

  const computed = computeNextGrid(currentGrid);
  cache.set(currentGrid, computed);
  return computed;
};

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
      return "The pattern has stabilized.";
    case "empty":
      return "The simulation has ended. All cells have died.";
    case "boundary-reached":
      return "The pattern has reached the edge of the board.";
    case "running":
      return "Simulation running.";
    case "paused":
      return "Simulation paused.";
    case "idle":
    default:
      return "Choose a pattern or draw on the board to begin.";
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
  const nextGenerationCacheRef = useRef<WeakMap<Grid, Grid>>(new WeakMap());

  const getNextGeneration = useCallback(
    (currentGrid: Grid) => getOrComputeNextGrid(nextGenerationCacheRef.current, currentGrid),
    [],
  );

  runningRef.current = isRunning;

  const aliveCells = countAliveCells(grid);
  const simulationStatus = useMemo<SimulationStatus>(() => {
    if (aliveCells === 0) return "empty";
    if (hasLiveCellsOnEdge(grid)) return "boundary-reached";
    const isStable = gridsEqual(grid, getNextGeneration(grid));
    if (isStable) return "stable";
    if (isRunning) return "running";
    if (generation === 0) return "idle";
    return "paused";
  }, [aliveCells, generation, getNextGeneration, grid, isRunning]);
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

    setGrid((g) => getNextGeneration(g));
    setGeneration((g) => g + 1);

    setTimeout(runSimulation, speed);
  }, [getNextGeneration, speed]);

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
    setGrid((g) => getNextGeneration(g));
    setGeneration((g) => g + 1);
  }, [getNextGeneration]);

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
