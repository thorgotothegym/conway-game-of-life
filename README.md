# Conway's Game of Life

A modern implementation of Conway's Game of Life built with Next.js, React and TypeScript.

The goal of this project is not just to recreate the classic simulation, but to use it as a playground to experiment with frontend architecture, rendering strategies, performance optimizations and, eventually, backend development with Python.

Instead of building another traditional CRUD application, I wanted to create something a little different: a project where I could explore how simple rules can lead to surprisingly rich behaviours while continuously iterating on both the technical implementation and the user experience.

Along the way, Conway became less of an experiment and more of a small product that I genuinely enjoyed polishing and shipping.

---

## Public Release

🚀 **Conway's Game of Life v1.0.0**

Live demo:

https://life.aleixvidal.dev

The current version focuses on delivering a polished desktop-first experience while serving as a playground for experimentation, architecture and iterative product improvements.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Tooling

- ESLint
- Prettier
- Husky
- lint-staged
- Knip
- Vitest

---

## Features

- Interactive Conway simulation
- Play, pause and step controls
- Pattern library including spaceships, oscillators and still lives
- Manual board editing
- Simulation statistics
- Friendly onboarding experience
- Pattern selection highlighting
- Sidebar filtering and navigation
- Keyboard shortcuts
- Import and export support
- Desktop-first experience with mobile guidance

---

## Design Direction

The UI is inspired by:

- Raycast
- Linear
- Vercel
- Modern macOS applications
- Engineering dashboards

The goal is to create a clean and modern simulation platform rather than a game-oriented interface.

---

## Future Exploration

Some ideas I may explore in future iterations include:

- Backend persistence
- Save and share simulations
- Infinite grid experiments
- Performance benchmarks
- Real-time collaboration
- WebSocket support
- Additional rendering strategies

The project evolves incrementally, guided by curiosity, experimentation and whatever feels worth building next.

---

## Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Run linting:

```bash
pnpm lint
```

Run type checking:

```bash
pnpm typecheck
```

Run all checks:

```bash
pnpm check
```

---

## Notes

This project is intentionally built incrementally.

The focus is on experimentation, learning and shipping ideas rather than trying to over-engineer everything from the beginning.

Sometimes the most interesting projects start as a small idea you're not entirely sure you'll finish.
