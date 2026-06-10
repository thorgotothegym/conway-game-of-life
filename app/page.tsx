"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ControlsToolBar } from "@/components/game/ControlsToolBar";
import { SimulationGrid } from "@/components/game/SimulationGrid";
import { StatsSidebar } from "@/components/game/StatsSidebar";
import { Header } from "@/components/layout/Header";
import { PatternsSidebar } from "@/components/layout/PatternsSidebar";
import { useGameOfLife } from "@/hooks/useGameOfLife";
import type { Grid, Pattern } from "@/lib/game-of-life";

export default function GameOfLifePage() {
  const {
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
    simulationStatusMessage,
    toggleCell,
    clear,
    randomize,
    step,
    toggle,
    updateGridSize,
    addPattern,
  } = useGameOfLife({ initialRows: 50, initialCols: 70 });

  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const [boardViewportSize, setBoardViewportSize] = useState({ width: 0, height: 0 });

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { target, key, preventDefault } = event;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (key.toLowerCase()) {
        case " ":
          preventDefault();
          toggle();
          break;
        case "s":
          if (!isRunning) step();
          break;
        case "r":
          randomize();
          break;
        case "c":
          handleClear();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, step, randomize, handleClear, isRunning]);

  const handleSelectPattern = useCallback(
    (pattern: Pattern) => {
      addPattern(pattern);
    },
    [addPattern],
  );

  const handleExport = useCallback(() => {
    const data = JSON.stringify(grid);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `life-pattern-gen${generation}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [grid, generation]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      try {
        const importedGrid = JSON.parse(text) as Grid;
        setGrid(importedGrid);
      } catch {
        console.error("Invalid file format");
      }
    };
    input.click();
  }, [setGrid]);

  useEffect(() => {
    const element = boardViewportRef.current;
    if (!element) return;

    const updateSize = () => {
      setBoardViewportSize({ width: element.clientWidth, height: element.clientHeight });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const cellSize = useMemo(() => {
    const fallbackSize = 12;

    if (boardViewportSize.width === 0 || boardViewportSize.height === 0) {
      return fallbackSize;
    }

    const availableCellSize = Math.min(
      boardViewportSize.width / gridSize.cols,
      boardViewportSize.height / gridSize.rows,
    );

    return Math.max(4, Math.min(14, Math.floor(availableCellSize)));
  }, [boardViewportSize.height, boardViewportSize.width, gridSize.cols, gridSize.rows]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden lg:h-screen">
      <Header gridSize={gridSize} onGridSizeChange={updateGridSize} />

      <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden p-4 lg:flex-row lg:gap-0 lg:p-0">
        <section className="w-full rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-xs text-muted-foreground backdrop-blur-md md:hidden">
          <p className="font-mono">[mobile note]</p>
          <p className="mt-1 text-balance">
            Designed for desktop. You can still explore Conway on mobile, but you will probably
            enjoy it more on a larger screen.
          </p>
        </section>

        <aside className="w-full shrink-0 min-h-0 overflow-hidden lg:w-64 lg:p-4">
          <PatternsSidebar onSelectPattern={handleSelectPattern} />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col items-center gap-6 overflow-auto px-0 lg:px-6 lg:py-6">
          <section className="w-full max-w-3xl rounded-xl border border-border/50 bg-card/60 px-4 py-4 text-sm text-muted-foreground backdrop-blur-md lg:px-5">
            <p>
              This is Conway’s Game of Life: a small simulation where simple rules create surprising
              patterns.
            </p>
            <p className="mt-2 text-center">
              Rules: Live cells survive with 2–3 neighbours. Dead cells are born with exactly 3
              neighbours. Everything else fades away.
            </p>
            <p className="mt-2 text-center">
              Pick a pattern, press Play, or draw on the board to experiment.
            </p>
          </section>

          <div
            ref={boardViewportRef}
            className="w-full min-h-[55vh] min-w-0 overflow-auto lg:flex-1 lg:min-h-0"
          >
            <div className="flex w-full justify-center lg:justify-center">
              <SimulationGrid grid={grid} onCellToggle={toggleCell} cellSize={cellSize} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ControlsToolBar
              isRunning={isRunning}
              speed={speed}
              onToggle={toggle}
              onStep={step}
              onClear={handleClear}
              onRandomize={randomize}
              onSpeedChange={setSpeed}
              onExport={handleExport}
              onImport={handleImport}
            />

            <div className="text-xs text-muted-foreground min-h-5 px-3 text-center">
              {simulationStatusMessage}
            </div>
          </div>
        </main>

        <aside className="w-full shrink-0 lg:w-64 lg:p-4">
          <StatsSidebar
            generation={generation}
            aliveCells={aliveCells}
            totalCells={totalCells}
            density={density}
            fps={fps}
            gridSize={gridSize}
            isRunning={isRunning}
          />
        </aside>
      </div>
    </div>
  );
}
