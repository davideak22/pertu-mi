# Technical Design Document: Pertu MI Ai MVP

## Overview

This document explains how we'll build **Pertu MI Ai** using a local-first, zero-latency multi-screen architecture. The implementation is optimized for the macOS dual-display ecosystem and runs completely client-side in the browser, eliminating setup overhead and reliability risks during live podcast recordings.

---

## Recommended Approach

### Best Path for You: Local-First Browser Sync (Near-Zero Latency)

Based on your requirement for instant sync and a $0 budget, here is the optimal strategy:

**Primary Approach: Native browser memory sync with `BroadcastChannel` API**
- **Why this works:** Rather than routing messages through an internet-based server or a local node process, it communicates directly on the browser's shared memory bus. Setup is lightweight, and transmission latency is < 2ms.
- **Time to MVP:** 1–2 days (using Antigravity for automated coding).
- **Learning curve:** Low. Excellent opportunity to understand native browser message systems and state synchronization.
- **Cost:** $0 (no external servers, databases, or API keys needed).

### Tech Stack

#### Frontend
- **Framework:** Next.js (React Client-Side App Router pages)
  - *Why:* Huge community, clean file-based routing for `/control` and `/projector`, and excellent AI compatibility.
- **Styling:** Vanilla CSS
  - *Why:* Maximum control over standard sizing, projector transitions, custom typography, and alignment.
- **Animations:** Framer Motion
  - *Why:* For liquid-smooth spring transitions between projector screen states (`idle` -> `transitioning` -> `typing`).

#### Backend
- **Service:** None (Fully offline client-side application)
  - *Why:* Kept local and serverless. State is pushed directly from control window to display window in real-time.

#### Deployment
- **Platform:** Vercel (Free Hobby Tier) or local hosting
  - *Why:* One-click deploy directly from GitHub, making it instantly accessible on localhost or a public URL.

#### AI Assistance
- **Primary IDE:** Antigravity (using automated agent commands to build and refine components).

---

## Technical Decisions & Alternatives

For an application that syncs screens locally, here is a comparison of state sharing mechanisms:

| Option | Latency | Complexity | Cost | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **`BroadcastChannel` API** | **< 2ms** | **Very Low** | **$0** | **Recommended.** Easiest setup, runs directly on the local browser memory bus. |
| **`localStorage` Events** | ~5-15ms | Medium | $0 | *Backup.* Stringifies payloads; requires manual cache busting. |
| **Local WebSockets** | ~10-30ms | High | $0 | *Overkill.* Requires running a custom Node.js loopback process. |

### Limitations & Trade-offs
- **Scope:** `BroadcastChannel` works only for windows/tabs running on the **same browser instance** (e.g., both screens connected to the same laptop).
- **Persistence:** Messages are stateless. If the projector tab is reloaded, it will stay in the `idle` state until the control panel triggers a "Re-Broadcast" command.

---

## Project Structure

```text
pertu-mi/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Global HTML shell & Font import
│   │   ├── globals.css            # Base stylesheet (dark theme variables)
│   │   ├── control/
│   │   │   └── page.tsx           # Host Control Panel Page
│   │   └── projector/
│   │       └── page.tsx           # Fullscreen Presentation View Page
│   ├── hooks/
│   │   └── usePodcastChannel.ts   # Custom hook wrapping BroadcastChannel
│   └── types/
│       └── index.ts               # Shared TypeScript interface models
├── public/                        # Static assets (logos, icons)
├── package.json                   # Project packages & startup scripts
└── TechDesign-Pertu-MI-Ai-MVP.md   # This document
```

---

## Building Each Feature

### Feature 1: Real-time Channel Sync (`usePodcastChannel.ts`)
**Complexity:** Low

#### Implementation Plan:
1. Create a custom React hook that instantiates a `BroadcastChannel` named `pertu_mi_production_stream`.
2. Clean up (close) the channel on hook unmount to prevent browser memory leaks.

```typescript
// src/types/index.ts
export type SystemState = "idle" | "transitioning" | "typing";

export interface BroadcastPayload {
  state: SystemState;
  promptText?: string;
  responseText?: string;
  timestamp: number;
}
```

```typescript
// src/hooks/usePodcastChannel.ts
import { useEffect, useRef, useCallback } from "react";
import { BroadcastPayload } from "../types";

const CHANNEL_NAME = "pertu_mi_production_stream";

export function usePodcastChannel(onMessageReceived?: (data: BroadcastPayload) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    if (onMessageReceived) {
      channel.onmessage = (event: MessageEvent<BroadcastPayload>) => {
        onMessageReceived(event.data);
      };
    }

    return () => {
      channel.close();
    };
  }, [onMessageReceived]);

  const broadcast = useCallback((payload: Omit<BroadcastPayload, "timestamp">) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        ...payload,
        timestamp: Date.now(),
      });
    }
  }, []);

  return { broadcast };
}
```

### Feature 2: Operator Control Panel (`/control`)
**Complexity:** Medium

#### Implementation Plan:
- UI layout designed for a laptop display containing:
  - Input field for "Prompt Text".
  - Textarea field for "Response Text".
  - **Broadcast Button:** Sends state `"transitioning"` containing inputs.
  - **Reset/Idle Button:** Sends state `"idle"` to return display to standby.
  - **State Indicator:** Shows what state is currently broadcasted.

### Feature 3: Projector Presentation Canvas (`/projector`)
**Complexity:** Medium-High (Requires precise animation timings)

#### State Flow & Animations:
1. **Idle State:** Renders ambient floating "Pertu Mi" brand text using a slow vertical looping bounce.
2. **Transitioning State:** Wipes in a full-screen geometric card using a custom clip-path slide in under 1.2s, showing the prompt text.
3. **Typing State:** Transitions to show the response text typing out letter by letter at 25ms intervals with a blinking amber caret.

---

## Development Setup

To initialize the project environment locally:

```bash
# 1. Run npx to set up a clean Next.js app with TypeScript and Tailwind/CSS configurations
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Install animation packages
npm install framer-motion

# 3. Spin up local development server
npm run dev
```

---

## AI Prompting Guide for Antigravity

Use these prompts to direct Antigravity during coding sessions:

**Prompt to implement UI Canvas (`/projector`):**
```text
I need to build a projector view page in Next.js (/projector).
Requirements:
1. It listens to state triggers ("idle", "transitioning", "typing") using the usePodcastChannel hook.
2. Under "idle", show floating brand text using Framer Motion loop animations.
3. Under "transitioning", wipe a screen-filling grid to display the prompt.
4. Under "typing", type out responseText character-by-character at 25ms speed with a blinking amber block cursor.
Keep the page overflow hidden, without scrollbars, on a dark neutral background.
```

**Prompt to fix communication disconnects:**
```text
State isn't updating on the projector canvas when I click Broadcast in the control dashboard.
Verify that usePodcastChannel initializes on the same channel string in both views and that state handlers correctly trigger React re-renders on receipt.
```

---

## Simplified Architecture

```text
[ Host Laptop /control Page ]
       │
       │ (1. Operator types texts & clicks "Broadcast")
       ▼
[ BroadcastChannel Local Bus ] ──( < 2ms latency transfer )──┐
                                                             │
                                                             ▼
                                             [ Display Screen /projector Page ]
                                             - Transition Wipe intro (1.2s)
                                             - Trigger active typewriter output
```

---

## Deployment & Production Configurations

### Deploy to Vercel (Hobby Free Tier)
1. Commit code changes to a GitHub repository.
2. Link the repository inside the Vercel Dashboard.
3. Vercel automatically deploys your project and serves it under a free production URL (e.g. `https://pertu-mi-ai.vercel.app`).

### Production Optimization (Dual Monitors)
1. Set up screens: Open Google Chrome on your secondary display and navigate to `/projector`.
2. Toggle full presentation canvas: Press `Cmd + Shift + F` inside Chrome to hide browser toolbars completely.
3. Prevent CPU sleep limits: Open terminal and type `caffeinate -dim` before recording.
4. Disable background window throttling:
   - Go to URL `chrome://flags/#calculate-native-win-occlusion` in Google Chrome.
   - Set to **Disabled** to guarantee smooth animations even when clicking off-screen.

---

## Cost Breakdown

| Category | Service / Tool | Cost |
| :--- | :--- | :--- |
| **Development** | Antigravity IDE | $0 (Local agent support) |
| **Hosting** | Vercel Free Plan | $0 / month |
| **Database** | None (Fully local browser state) | $0 |
| **Total** | | **$0** |

---

## Success Metrics

Your technical implementation is successful when:
- [ ] Clicking "Broadcast" updates the presentation screen in < 5ms.
- [ ] No scroll bars appear on the `/projector` page at 1080p/4K resolutions.
- [ ] System handles continuous state switching over 2 hours without browser tab crashes.
- [ ] Deploy scripts run without compilation warnings.

---
*Technical Design for: Pertu MI Ai*
*Approach: Local-first Single-Origin BroadcastChannel*
*Estimated Time to MVP: 2 Days*
*Estimated Cost: $0*
