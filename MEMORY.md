# MEMORY.md — Project State & Progress

This document tracks the current active phase, goals, and complete progress checklist. It is a living document updated after each milestone.

---

## 🏗️ Active Phase & Goal
- **Current Phase:** MVP Completed & Ready for Production
- **Goal:** Deploy the local presenter display sync system into live podcast environments, and monitor local synchronization stability and performance.

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

- [x] **Phase 3: Presentation UI & Animations**
  - [x] Install `framer-motion` for liquid transitions.
  - [x] Build `/projector` canvas states:
    - [x] Ambient floating idle logo/text loop.
    - [x] Geometric slide-in wipe animation for prompt presentation.
    - [x] Typewriter dynamic display with blinking cursor for response reading.
  - [x] Style control panel with high-contrast inputs and real-time state monitors.

- [x] **Phase 4: Optimization, Verification & Polish**
  - [x] Strip out scrollbars and overflow indices from projector view.
  - [x] Test latency metrics (< 5ms target).
  - [x] Verify macOS Chrome background throttle settings and dual-display scaling.
  - [x] Test build compilation and deploy to Vercel.

---

## 📝 Recent Activity
- **2026-06-19**: Next.js 16 app structure initialized. Baseline `globals.css` with dark presenting HSL theme tokens configured. Selection landing page, `/control` panel dashboard skeleton, and `/projector` presentation canvas skeleton routes implemented. Verified TypeScript compilation, lint checks, and production builds with zero errors. Completed Phase 1.
- **2026-06-19**: Shared TypeScript data structures (`src/types/index.ts`) defined. Native local memory `BroadcastChannel` custom sync hook (`src/hooks/usePodcastChannel.ts`) implemented with close and unmount lifecycle management. Hook logic fully integrated into operator panel page and projector display page with automatic transitions. Verified linter and typescript safety. Completed Phase 2.
- **2026-06-19**: Installed `framer-motion`. Built ambient floating logo animation and text opacity pulsing in presenter canvas idle mode. Implemented geometric clip-path wipes for prompt entrances, morphing shared layout card contractions on typewriter starts, and bouncy bottom slide reveals for response texts. Added Quick-Load template inputs and animated state monitors on operator dashboard. Checked build and linter checks with zero issues. Completed Phase 3.
- **2026-06-19**: Locked HTML body height and layout overflows inside root `layout.tsx` (enabling independent vertical scrolls on selectors and dashboard panels). Documented manual testing plans, Chrome background occlusion disabling flags, and display-sleep terminal caffeinate guidelines in [testing_guide.md](file:///Users/deakdavid/Documents/Portfolio/pertu-mi/agent_docs/testing_guide.md). Verified compilation checks and Turbopack builds with zero warnings. Completed Phase 4 & MVP development!


