# Project Brief (Persistent Rules)

This document establishes the foundational design tenets, coding style guidelines, and quality gates for the Pertu MI Ai codebase.

---

## 🎯 Product Vision
Build an offline-first, zero-config browser sync setup that connects a podcast host's control dashboard with a secondary screen projector layout under < 5ms latency, prioritizing extreme fluid animation, visual aesthetics, and rock-solid local reliability.

---

## 🏗️ Architectural Guidelines & Patterns
1. **Client-Only Architecture**: The entire state flow is synchronous and client-side. The dashboard writes to the channel and the projector canvas reads it.
2. **Type Safety & No Any**: Explicit type definitions are required for all hook payloads and component properties. Use Zod validation if reading from custom local configs.
3. **Vanilla CSS Focus**: The visual layout should not feel standard or templated. Apply custom background radial/linear gradients, clean typewriter styling, and custom animations directly in `globals.css` rather than utilizing default utility frameworks.
4. **State Isolation**: Encapsulate message synchronization logic in custom React hooks. Keep `/control` and `/projector` pages pure from direct browser-native instantiation.

---

## 🚦 Quality Gates & Review Standards
- **Linter Compliance**: Must pass standard ESLint rules with zero exceptions.
- **Verification Loop**: Test changes in a split browser environment. Ensure transitions function consistently under extreme resizing.
- **Performance Budget**: Trigger state updates must sync in < 5ms. Frame rates for transition wipes must hold 60fps.
- **Browser Presentation Validation**: Visual outputs on `/projector` must remain free from scrolls and menu bars under Chrome/Safari fullscreen views.

---

## 🔧 Key Commands
- `npm run dev` — Spins up the local Next.js client on `localhost:3000`.
- `npm run build` — Compiles the client app for Vercel/production.
- `npm run lint` — Runs TypeScript and CSS check checks.

---

## 🔄 Update Cadence
This brief is a living document. It should be revised and updated when:
1. State management conventions shift (e.g., adding local history caching).
2. Animations are upgraded or extra assets are added.
3. Dev dependencies or linting configurations change.
