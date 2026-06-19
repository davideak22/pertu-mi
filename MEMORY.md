# MEMORY.md — Project State & Progress

This document tracks the current active phase, goals, and complete progress checklist. It is a living document updated after each milestone.

---

## 🏗️ Active Phase & Goal
- **Current Phase:** Phase 3 — Presentation UI & Animations
- **Goal:** Install `framer-motion` for spring-based physics, implement the fullscreen projector intro wipe transition and advanced typewriter animations, and finish operator dashboard layouts with live channel state feedback.

---

## 🗺️ Project Roadmap

- [x] **Phase 1: Project Setup & Baseline Layouts**
  - [x] Initialize Next.js project using `create-next-app` CLI with app router, typescript, and eslint.
  - [x] Configure global styles (`globals.css`) with HSL variables for dark presentation themes.
  - [x] Implement baseline layout and routes for host dashboard (`/control`) and canvas (`/projector`).
  
- [x] **Phase 2: Hook Logic & Communication Bus**
  - [x] Define shared TypeScript types for message payloads (`src/types/index.ts`).
  - [x] Implement custom React hook `usePodcastChannel` using native `BroadcastChannel` API (`src/hooks/usePodcastChannel.ts`).
  - [x] Integrate hook state handlers into `/control` dashboard inputs.

- [ ] **Phase 3: Presentation UI & Animations**
  - [ ] Install `framer-motion` for liquid transitions.
  - [ ] Build `/projector` canvas states:
    - [ ] Ambient floating idle logo/text loop.
    - [ ] Geometric slide-in wipe animation for prompt presentation.
    - [ ] Typewriter dynamic display with blinking cursor for response reading.
  - [ ] Style control panel with high-contrast inputs and real-time state monitors.

- [ ] **Phase 4: Optimization, Verification & Polish**
  - [ ] Strip out scrollbars and overflow indices from projector view.
  - [ ] Test latency metrics (< 5ms target).
  - [ ] Verify macOS Chrome background throttle settings and dual-display scaling.
  - [ ] Test build compilation and deploy to Vercel.

---

## 📝 Recent Activity
- **2026-06-19**: Next.js 16 app structure initialized. Baseline `globals.css` with dark presenting HSL theme tokens configured. Selection landing page, `/control` panel dashboard skeleton, and `/projector` presentation canvas skeleton routes implemented. Verified TypeScript compilation, lint checks, and production builds with zero errors. Completed Phase 1.
- **2026-06-19**: Shared TypeScript data structures (`src/types/index.ts`) defined. Native local memory `BroadcastChannel` custom sync hook (`src/hooks/usePodcastChannel.ts`) implemented with close and unmount lifecycle management. Hook logic fully integrated into operator panel page and projector display page with automatic transitions. Verified linter and typescript safety. Completed Phase 2.
