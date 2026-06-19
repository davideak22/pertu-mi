# REVIEW-CHECKLIST.md — Quality Gates & Pre-Release Checklist

Ensure all features and modifications pass the following checks before marking them as complete.

---

## 💻 Code Quality & Architecture
- [ ] **TypeScript Safety**: Strictly no usage of `any` types. All parameters, component properties, and returns are properly typed.
- [ ] **State Cleanups**: All React lifecycle events, channels, timeouts, and animation frames clean up properly on unmount (e.g., closing `BroadcastChannel`).
- [ ] **Offline Isolation**: No remote resources, styles, or APIs are requested during execution.
- [ ] **Architecture Sovereign**: Business and broadcast logic is cleanly encapsulated in the `src/hooks/` and types folder, not inline inside component layout code.

---

## 🎨 Visuals & UX
- [ ] **Slate Theme Integrity**: Dark colors only (no default backgrounds or primary generic colors). Harmonious HSL colors are maintained.
- [ ] **No Scrollbars**: Projector view is `overflow-hidden` at 1080p and 4K screen sizes. No visual scroll scrollbars appear.
- [ ] **Fluid Motion**: Transitions use physics-based spring models from Framer Motion rather than static linear transitions.
- [ ] **No Placeholders**: Real brand headers and inputs are used. No lorem ipsum text is visible on the presentation screen.

---

## ⚡ Sync Performance
- [ ] **Under 5ms latency**: Transition triggers must execute near-instantly when running across dual windows.
- [ ] **Throttling Resiliency**: The project runs smoothly even when windows are clicked off-screen (with Chrome's Native Window Occlusion disabled).

---

## 🚀 Verification Checks
- [ ] Run `npm run lint` and verify zero errors.
- [ ] Run `npm run build` to verify production compiler success.
- [ ] Open dual browser screens and verify successful synchronization.
