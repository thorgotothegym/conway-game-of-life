"use client";

import { Grid3X3, Settings2 } from "lucide-react";

import { GAME_NAME, GRID_SIZE_DEFAULTS, SIMULATOR_NAME } from "@/app/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HeaderProps = {
  gridSize: { rows: number; cols: number };
  onGridSizeChange: (rows: number, cols: number) => void;
};

export const Header = ({ gridSize, onGridSizeChange }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/40 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 border border-primary/20">
          <Grid3X3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight">
            {SIMULATOR_NAME}
          </h1>
          <p className="text-xs text-muted-foreground">{GAME_NAME}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* GridSize */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Grid3X3 className="h-4 w-4" />
              <span className="font-mono text-xs">
                {gridSize.rows} × {gridSize.cols}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Grid Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {GRID_SIZE_DEFAULTS.map(({ label, rows, cols, description }) => (
              <DropdownMenuItem
                key={label}
                onClick={() => onGridSizeChange(rows, cols)}
                className="flex justify-between"
              >
                <span>{label}</span>
                <span className="text-xs text-muted-foreground font-mono">{description}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};
