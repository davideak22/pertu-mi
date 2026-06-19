# Testing & Verification Strategy

This document outlines the testing protocols, environments, manual checklists, and automated gates for the project.

---

## 🤖 Automated Testing Frameworks

### 1. Unit & Hook Testing
- **Tool**: **Vitest** + **React Testing Library**
- **Purpose**: Test state updates, payload conversions, and unmount cleanups in the `usePodcastChannel` custom hook.
- **Verification Criteria**:
  - Hook successfully registers a listener on the `BroadcastChannel`.
  - Hook shuts down and closes the channel cleanly upon component unmount.
  - Broadcast functions output correctly-formed payloads.

### 2. End-to-End (E2E) Synchronization Testing
- **Tool**: **Playwright**
- **Purpose**: Automate dual-screen browser instances to check synchronization flow from `/control` to `/projector`.
- **Verification Criteria**:
  - Spin up `/control` in Browser A and `/projector` in Browser B.
  - Input prompt/response texts in `/control` and trigger broadcast.
  - Assert that the projector viewport in Browser B receives the text payloads and transitions from `idle` to `transitioning` to `typing` states.

---

## 📺 Manual Studio Verification Checklist
Since this application runs in physical studio environments on multiple monitors, manual verification is critical:

- **Fullscreen presentation check**:
  1. Open `/projector` in Chrome on the secondary screen.
  2. Press `Cmd + Shift + F` to enter presentation mode.
  3. Ensure zero scrollbars, HTML page margins, or cursor overlaps appear.
- **Browser window occlusion test**:
  1. Click away from the projector tab (making it a background window).
  2. Perform updates from `/control`.
  3. Verify that animations trigger instantly and do not lag or pause when the projector tab loses active focus. (Disable Chrome occlusion flags if necessary).
- **Latency evaluation**:
  - Ensure states switch cleanly in under 5ms.
- **Reload resiliency test**:
  1. Reload the `/projector` screen.
  2. Verify it displays the `idle` float mode.
  3. Click "Broadcast" on `/control` to confirm re-sync is instant.

---

## 🔄 Verification & Pre-Commit Loop
Configure automated checks before commits are finalized:

- **Pre-commit script**:
  - Runs ESLint: `npm run lint`
  - Verifies type integrity: `npx tsc --noEmit`
- **Verification Loop workflow**:
  1. Code a small feature segment.
  2. Run local tests.
  3. Manually verify dual-window behavior in the browser.
  4. Address lint and type errors before committing.
