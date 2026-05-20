"use client";

import { Activity, Clock, Cpu, Grid3X3 } from "lucide-react";

import { GAME_NAME } from "@/app/const";
import { Progress } from "@/components/ui/progress";

import { StatCard } from "./StatCard";

type StatsSidebarProps = {
  generation: number;
  aliveCells: number;
  totalCells: number;
  density: string;
  fps: number;
  gridSize: { rows: number; cols: number };
  isRunning: boolean;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export function StatsSidebar({
  generation,
  aliveCells,
  totalCells,
  density,
  fps,
  gridSize,
  isRunning,
}: StatsSidebarProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground">Statistics</h2>
      </div>

      <div className="p-4 space-y-6">
        <StatCard icon={Clock} label="Generation" value={formatNumber(generation)} accent />

        <div className="space-y-2">
          <StatCard
            icon={Activity}
            label="Alive Cells"
            value={formatNumber(aliveCells)}
            subValue={`of ${formatNumber(totalCells)}`}
          />

          <div className="px-1">
            <Progress value={Number(density)} className="h-1.5" />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">Density</span>
              <span className="text-[10px] font-mono text-muted-foreground">{density}%</span>
            </div>
          </div>
        </div>

        <StatCard
          icon={Grid3X3}
          label="Grid Size"
          value={`${gridSize.rows} × ${gridSize.cols}`}
          subValue={`${formatNumber(totalCells)} cells`}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Cpu className="h-3.5 w-3.5" />
            Performance
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="px-3 py-2.5 rounded-lg bg-background/50 border border-border/30">
              <div className="text-xs text-muted-foreground">FPS</div>
              <div className="text-lg font-semibold font-mono text-foreground">
                {isRunning ? fps : "—"}
              </div>
            </div>

            <div className="px-3 py-2.5 rounded-lg bg-background/50 border border-border/30">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isRunning ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                  }`}
                />
                <span className="text-xs font-medium text-foreground">
                  {isRunning ? "Running" : "Paused"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-border/50">
        <div className="text-[10px] text-muted-foreground text-center">{GAME_NAME}</div>
      </div>
    </div>
  );
}
