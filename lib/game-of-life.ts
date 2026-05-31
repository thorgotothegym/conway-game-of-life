export type Grid = boolean[][];

export type Pattern = {
  id: string;
  name: string;
  description: string;
  category: "still" | "oscillator" | "spaceship" | "custom";
  cells: [number, number][];
};

export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
}

export function createRandomGrid(rows: number, cols: number, density = 0.3): Grid {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => Math.random() < density),
    );
}

export function countNeighbors(grid: Grid, row: number, col: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol]) count++;
    }
  }

  return count;
}

export function nextGeneration(grid: Grid): Grid {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = createEmptyGrid(rows, cols);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(grid, i, j);
      if (grid[i][j]) {
        newGrid[i][j] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[i][j] = neighbors === 3;
      }
    }
  }

  return newGrid;
}

export function countAliveCells(grid: Grid): number {
  return grid.reduce(
    (acc, row) => acc + row.reduce((rowAcc, cell) => rowAcc + (cell ? 1 : 0), 0),
    0,
  );
}

export function placePattern(
  grid: Grid,
  pattern: Pattern,
  startRow: number,
  startCol: number,
): Grid {
  const newGrid = grid.map((row) => [...row]);
  const rows = grid.length;
  const cols = grid[0].length;

  pattern.cells.forEach(([r, c]) => {
    const targetRow = startRow + r;
    const targetCol = startCol + c;

    if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols) return;
    newGrid[targetRow][targetCol] = true;
  });

  return newGrid;
}
