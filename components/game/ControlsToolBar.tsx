"use client";

import {
  Download,
  Keyboard,
  Pause,
  Play,
  Shuffle,
  SkipForward,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ControlsToolBarProps = {
  isRunning: boolean;
  speed: number;
  onToggle: () => void;
  onStep: () => void;
  onClear: () => void;
  onRandomize: () => void;
  onSpeedChange: (speed: number) => void;
  onExport: () => void;
  onImport: () => void;
};

const shortcuts = [
  { action: "Play/Pause", keys: ["Space"] },
  { action: "Step", keys: ["S"] },
  { action: "Randomize", keys: ["R"] },
  { action: "Clear", keys: ["C"] },
];

export const ControlsToolBar = ({
  isRunning,
  speed,
  onToggle,
  onStep,
  onClear,
  onRandomize,
  onSpeedChange,
  onExport,
  onImport,
}: ControlsToolBarProps) => {
  const speedInGenPerSec = Math.round(1000 / speed);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-between gap-6 px-4 py-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-md shadow-xl">
        {/* Controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRunning ? "default" : "secondary"}
                size="icon"
                onClick={onToggle}
                className="h-9 w-9"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="flex items-center gap-2">
              {isRunning ? "Pause" : "Play"} <Kbd>Space</Kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onStep}
                disabled={isRunning}
                className="h-9 w-9"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="flex items-center gap-2">
              Step <Kbd>S</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Speed
          </span>
          <Slider
            value={[speed]}
            onValueChange={([v]) => onSpeedChange(v)}
            min={10}
            max={500}
            step={10}
            className="w-32"
          />
          <span className="text-xs text-muted-foreground font-mono w-14">
            {speedInGenPerSec} gen/s
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRandomize} className="h-9 w-9">
                <Shuffle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="flex items-center gap-2">
              Randomize <Kbd>R</Kbd>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onClear} className="h-9 w-9">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="flex items-center gap-2">
              Clear <Kbd>C</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExport} className="h-9 w-9">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Export pattern</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onImport} className="h-9 w-9">
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Import pattern</TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Keyboard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="w-48">
            <div className="space-y-1.5 text-xs">
              {shortcuts.map(({ action, keys }) => (
                <div key={action} className="flex justify-between">
                  <span>{action}</span>
                  <div className="flex gap-1">
                    {keys.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
