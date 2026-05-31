"use client";

import { Box, Grid3X3, Rocket, Search, Zap } from "lucide-react";
import { useState } from "react";

import { PATTERNS } from "@/app/const";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Pattern } from "@/lib/game-of-life";

import { PatternItem } from "./PatternItem";

type PatternsSidebarProps = {
  onSelectPattern: (pattern: Pattern) => void;
};

const categoryIcons = {
  still: Box,
  oscillator: Zap,
  spaceship: Rocket,
  custom: Grid3X3,
};

const categoryLabels = {
  still: "Still Lives",
  oscillator: "Oscillators",
  spaceship: "Spaceships",
  custom: "Custom",
};

export const PatternsSidebar = ({ onSelectPattern }: PatternsSidebarProps) => {
  const [search, setSearch] = useState("");

  const filteredPatterns = PATTERNS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const groupedPatterns = filteredPatterns.reduce(
    (acc, pattern) => {
      if (!acc[pattern.category]) acc[pattern.category] = [];
      acc[pattern.category].push(pattern);
      return acc;
    },
    {} as Record<string, Pattern[]>,
  );

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-foreground mb-3">Patterns</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background/50 border-border/50 text-sm"
          />
        </div>
      </div>

      {/* Patterns List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {Object.entries(groupedPatterns).map(([category, patterns]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <div key={category}>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </span>
                </div>
                <div className="space-y-1">
                  {patterns.map((pattern) => (
                    <PatternItem
                      key={pattern.id}
                      pattern={pattern}
                      onSelect={() => onSelectPattern(pattern)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filteredPatterns.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">No patterns found</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
