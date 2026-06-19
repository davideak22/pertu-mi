# Product Requirements Document: Pertu MI Ai MVP

## Overview

**Product Name:** Pertu MI Ai
**Problem Statement:** Podcast operators need a reliable, latency-free method to sync dynamic prompt and response texts from their control laptop to a secondary presenter or projector screen during live recordings. Existing server-reliant multi-screen tools introduce network latency, setup overhead, and reliability risks for live events.
**MVP Goal:** Build a local-first browser-based multi-screen display system that uses native browser APIs to sync the operator control dashboard with a presentation canvas in near-zero latency (< 5ms) without a web server back-end.
**Target Launch:** 2–3 day sprint

## Target Users

### Primary User Profile
**Who:** Podcast hosts, operators, or live producers.
**Problem:** Need to display prompt queries and responses to the guest or camera overlay on a secondary monitor cleanly, without mouse dragging, browser menu bars, or lag.
**Current Solution:** Manually dragging Chrome tabs to secondary screens, using static slide software, or custom local server setups.
**Why They'll Switch:** Instant, zero-config browser sync, elegant animations, and clean presentation mode without network latency.

### User Persona: Dave (The Live Producer)
- **Demographics:** Age 25–40, running a tech/discussion podcast.
- **Tech Level:** Intermediate (comfortable with browser presentation mode, local dev tools, and basic command lines).
- **Goals:** Keep the podcast conversation moving dynamically by presenting live reference prompts and texts seamlessly on screen.
- **Frustrations:** Technical delays, internet dropouts, and clunky presentation slide setups mid-recording.

## User Journey

### The Story
Dave is setting up his podcast studio. He opens the **Pertu MI Ai** dashboard on his laptop and opens the projector URL on the second display. When he wants to show a reference prompt and response to his guest, he pastes the text into the control dashboard and hits "Broadcast". Instantly, the guest's screen transitions cleanly from a floating idle logo to a striking prompt card, then types out the response character by character. The guest reads it, comments on it, and Dave resets the view once done.

### Key Touchpoints
1. **Discovery & Boot:** Operator opens the control panel and secondary presentation window locally.
2. **First Contact:** Operator aligns pages (`/control` on laptop, `/projector` on secondary display).
3. **Onboarding:** Operator runs a quick "Test Broadcast" to verify local communication channel is working.
4. **Core Loop:** Operator inputs prompt/response -> Broadcast -> Projector updates -> Operator clicks "Reset to Idle".
5. **Retention:** Zero-friction execution during the live show ensures it becomes a permanent part of their podcast toolkit.

## MVP Features

### Core Features (Must Have)

#### 1. Host Control Dashboard (`/control`)
- **Description:** Web UI for the host/operator containing input fields and controls.
- **User Value:** Simple interface to feed texts and trigger screen wipes without leaving the host dashboard window.
- **Success Criteria:**
  - Standard text fields for "Prompt" and "Response".
  - A "Broadcast" button to trigger the transitions.
  - An "Idle / Reset" button to return the projector to the ambient state.
- **Priority:** Critical

#### 2. Projector View (`/projector`)
- **Description:** Fullscreen clean presentation layout designed for the secondary screen.
- **User Value:** Provides a polished, hardware-like visual display containing zero browser chrome (toolbars/menus).
- **Success Criteria:**
  - **Idle State:** Renders ambient floating "Pertu Mi" brand text.
  - **Transitioning State:** Renders a clean geometric intro wiping in the user's prompt text.
  - **Typing State:** Renders the live response text using a typewriter effect with a blinking caret cursor.
- **Priority:** Critical

#### 3. Zero-Latency Local Sync
- **Description:** Shared communication line utilizing browser-native `BroadcastChannel` API.
- **User Value:** Zero internet or local WebSocket server setup needed. Operates directly on the browser's memory bus.
- **Success Criteria:**
  - Instantly syncs state modifications (idle, transitioning, typing, values) from `/control` to `/projector` in < 5ms.
- **Priority:** Critical

### Future Features (Not in MVP)
| Feature | Why Wait | Planned For |
|---------|----------|-------------|
| Actual AI API Generation | Keeps MVP simple and local. Pasting text manually is sufficient for v1. | Version 2 |
| Local History Log | Nice to have but doesn't block the core live execution loop. | Version 2 |
| Remote WebSockets Sync | Only needed if the control and display screens are on separate machines. | Version 2 |

## Success Metrics

### Primary Metrics
1. **Live Broadcast Success:** Run an entire podcast recording session (typically 1–2 hours) with 100% sync reliability.
   - How to measure: Monitor system console for any channel errors or memory leak warnings.
   - Why it matters: Prevents embarrassing production glitches in front of live guests.

### Secondary Metrics
- **Sync Latency:** Under 5 milliseconds for frame trigger signals.
- **Boot Time:** Development environment to active dual-screen state in less than 30 seconds.

## UI/UX Direction

**Design Feel:** Clean, premium, local-production look. Dark colors optimized for screens/projectors to prevent bright camera glares.
**Inspiration:** High-end stream overlays, premium terminal aesthetics.

### Color Palette
- **Slate Gray:** Dark slate surfaces for high-contrast presentation text.
- **Blue & Dark Blue:** Indigo/navy gradients and shadows to establish depth.
- **White:** Primary text color for high readability.
- **Amber/Orange (Accent):** Typewriter cursor highlight to draw the eye.

### Key Screens
1. **Operator Dashboard (`/control`):**
   - Clean, functional sidebar panel with input fields.
   - Live status monitor showing the current projector state (Idle, Transitioning, Typing).
2. **Projector Canvas (`/projector`):**
   - Fullscreen `overflow-hidden` canvas optimized for 1080p/4K projector scaling.
   - High-contrast visual grids and dynamic animations.

### Design Principles
- **No Light Glares:** Rely on dark blue/slate gray backgrounds. White is used only for text symbols.
- **Smooth Framer Motion Transitions:** Animations must feel liquid, using spring dynamics rather than linear ease values.

## Technical Considerations

**Platform:** Web (Next.js client-only App Router pages)
**Responsive:** Dashboard is laptop-optimized. Projector canvas is screen-locked (centered scaling for 16:9 displays).
**Performance Goals:**
- State transition response: < 5ms (via `BroadcastChannel`).
- Frame rate: Solid 60fps animations.
- Page load: < 2 seconds local execution.
**Security/Privacy:** Fully offline operational capability. No private user data leaves the local memory space.
**Browser Support:** Modern Google Chrome or Safari (latest version support for Presentation Mode).

## Constraints & Requirements

### Budget
- Hosting/Deployment: $0 (Runs locally via `npm run dev` / localhost).
- Third-party APIs: $0 (No AI keys or cloud databases required).
- **Total:** $0

### Timeline
- MVP Architecture & Coding: 1–2 days.
- Studio Integration Testing: 1 day.
- **Target Launch:** Immediate production use.

## Open Questions & Assumptions
- **Assumption:** The host laptop and presentation monitor are physically wired or using macOS AirPlay/Sidecar.
- **Open Question:** Do we want a small sound effect (SFX) cue to play on the projector screen during transition wipes? (Can be deferred to v2 if not critical).

## Quality Standards

**Code Quality:**
- Enforce strict typing in React.
- Handle state cleanups on React hook unmounts to prevent memory leakage from repeated channel instances.

**Design Quality:**
- Zero plain colors. Use tailored HSL slate/blue coordinates.
- Never use placeholder texts ("Lorem ipsum") in live views.
- Clean scroll and overflow handling (no scrolling indicators on `/projector` screen).

**What This Project Will NOT Accept:**
- Heavy Node server dependencies for state sharing (keep it client-side native).
- Broken or laggy state animations during transitions.

## Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| Browser window occlusion / Background throttle | High | Use manual instructions to toggle `#calculate-native-win-occlusion` flag in Chrome if needed, and verify active event loops. |
| Page refreshes lose active frame | Medium | BroadcastChannel API is stateless. The `/control` panel will maintain the current active values so the operator can hit "Re-Broadcast" instantly to sync if the projector is refreshed. |

## MVP Completion Checklist

### Development Complete
- [ ] Next.js app layout initialized.
- [ ] `/control` input form and state triggers operational.
- [ ] `/projector` canvas layout with Idle, Transition, and Typing animations.
- [ ] Native `BroadcastChannel` hook (`usePodcastChannel.ts`) bridging the screens.
- [ ] Smooth typewriter animation component completed.

### Quality Checks
- [ ] Tested locally on dual monitors.
- [ ] Verified Chrome presentation mode (`Cmd+Shift+F`) hides all UI bounds.
- [ ] Zero lag, flickering, or text wrapping issues on projector screen.

## Next Steps

1. **Immediate:** Review and approve this PRD.
2. **Next:** Create Technical Design Document (Part 3).
3. **Build:** Initialize code repository and write components.
4. **Test:** Local studio simulation run.
5. **Launch:** Run live podcast episode!
