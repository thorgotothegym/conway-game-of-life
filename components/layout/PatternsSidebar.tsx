"use client";

import { Box, ChevronRight, Rocket, Search, Zap } from "lucide-react";
import { useState } from "react";

import { PATTERNS } from "@/app/const";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Pattern } from "@/lib/game-of-life";

import { PatternItem } from "./PatternItem";

type PatternsSidebarProps = {
  onSelectPattern: (pattern: Pattern) => void;
};

type PatternCategory = "spaceship" | "oscillator" | "still";

const categoryIcons = {
  still: Box,
  oscillator: Zap,
  spaceship: Rocket,
};

const categoryLabels = {
  still: "Still Lives",
  oscillator: "Oscillators",
  spaceship: "Spaceships",
};

const categoryOrder: PatternCategory[] = ["spaceship", "oscillator", "still"];

export const PatternsSidebar = ({ onSelectPattern }: PatternsSidebarProps) => {
  const [search, setSearch] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<{ id: string; name: string } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<PatternCategory, boolean>>({
    spaceship: true,
    oscillator: true,
    still: true,
  });

  const handleSelectPattern = (pattern: Pattern) => {
    setSelectedPattern({ id: pattern.id, name: pattern.name });
    onSelectPattern(pattern);
  };

  const filteredPatterns = PATTERNS.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const groupedPatterns = filteredPatterns.reduce(
    (acc, pattern) => {
      if (pattern.category in acc) {
        const category = pattern.category as PatternCategory;
        acc[category].push(pattern);
      }
      return acc;
    },
    {
      spaceship: [],
      oscillator: [],
      still: [],
    } as Record<PatternCategory, Pattern[]>,
  );

  const toggleCategory = (category: PatternCategory) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-md">
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
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-3 space-y-4">
          {categoryOrder.map((category) => {
            const patterns = groupedPatterns[category];

            if (patterns.length === 0) return null;

            const Icon = categoryIcons[category];
            const isExpanded = expandedCategories[category];

            return (
              <div key={category}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-accent/40"
                >
                  <ChevronRight
                    className={[
                      "h-3.5 w-3.5 text-muted-foreground transition-transform",
                      isExpanded ? "rotate-90" : "rotate-0",
                    ].join(" ")}
                  />
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {categoryLabels[category]}
                  </span>
                </button>

                {isExpanded && (
                  <div className="space-y-1">
                    {patterns.map((pattern) => (
                      <div
                        key={pattern.id}
                        className={[
                          "rounded-lg border transition-colors",
                          selectedPattern?.id === pattern.id
                            ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
                            : "border-transparent",
                        ].join(" ")}
                      >
                        <PatternItem
                          pattern={pattern}
                          onSelect={() => handleSelectPattern(pattern)}
                        />
                      </div>
                    ))}
                  </div>
                )}
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
