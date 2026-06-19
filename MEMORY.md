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
- **2026-06-19**: Integrated `react-markdown` library into the presenter canvas (`/projector`) to support rich formatted markdown. Custom CSS styles added to `globals.css`. Mapped block paragraphs to inline spans in page renderer to resolve invalid DOM nesting and align the typewriter cursor. Scaled up content wrappers (`max-w-6xl`) and text size bounds (prompts to `text-7xl`, response to `text-5xl`) to guarantee legibility from a 1.5m viewing distance. Resolved logo overlap bug by converting the layout to a vertically structured relative flex column. Fixed logo loading across pages by replacing Next.js `<Image>` components with standard `<img>` tags. Resolved typewriter eaten-first-letter bug by refactoring text accumulation into a stable `typedLength` string-slicing method, combined with a `useRef` stabilized `usePodcastChannel` BroadcastChannel lifecycle. Implemented a ChatGPT-style conversation bubble layout on the presenter screen, complete with custom styled bubbles, and an AI Model Selector supporting ChatGPT, Claude, Gemini, or custom models paired with high-fidelity inline SVGs. Relocated the active brand logo to an absolute corner position (`absolute top-8 left-8`) and added dynamic scrolling overflow bounds (`overflow-y-auto`) to completely prevent screen clipping and card collisions. Imported custom high-fidelity brand logo assets for ChatGPT, Claude, and Gemini into static resources (`public/`) with clean professional names, integrating them into the presenter screen avatar panels. Verified TypeScript, ESLint, and production builds compile successfully.
- **2026-06-19**: Widened presenter canvas container widths to `90vw` and card limits to `85%`. Scaled up typography levels to allow larger text to appear. Added character-length checks to automatically hide the blinking typewriter cursor once printing completes. Combined the transitioning and typing presentation states into a single persistent session layout with Framer Motion layout morphing, creating a fluid, seamless animation path. Run compilation checks successfully.
- **2026-06-19**: Enabled Framer Motion `<motion.span layout>` and `<motion.p layout>` projection elements inside the prompt card to interpolate text dimensions smoothly during layout state swaps. Extended the transitioning state auto-timer delay inside the operator panel control code from 1.5 seconds to 3.5 seconds.
- **2026-06-19**: Updated the static vector asset `public/chatgpt.svg` with a white fill path attribute, ensuring the brand logo renders in clean high-contrast white on the dark presenter screen.



