"use client";

import { useCallback, useEffect } from "react";

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
          clear();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, step, randomize, clear, isRunning]);

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

  const getCellSize = () => {
    if (gridSize.cols > 100) return 8;
    if (gridSize.cols > 70) return 10;
    return 12;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header gridSize={gridSize} onGridSizeChange={updateGridSize} />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 p-4 shrink-0">
          <PatternsSidebar onSelectPattern={handleSelectPattern} />
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-6 overflow-auto">
          <SimulationGrid grid={grid} onCellToggle={toggleCell} cellSize={getCellSize()} />

          <div className="flex flex-col items-center gap-2">
            <ControlsToolBar
              isRunning={isRunning}
              speed={speed}
              onToggle={toggle}
              onStep={step}
              onClear={clear}
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

        <aside className="w-64 p-4 shrink-0">
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
