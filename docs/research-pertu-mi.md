This blueprint provides a production-grade, local-first architectural implementation for the **Pertu Mi Podcast Projector Display System**. It balances near-zero latency state updates with predictable multi-window rendering under a compressed production timeline.

---

## 1. State Sharing Comparison Table

For a local, single-origin macOS multi-screen workflow without external network boundaries, native web clients offer faster setup times and lower transport overhead than an orchestrated server framework like WebSockets.

| Metric / Mechanism  | `BroadcastChannel` API                                                                            | `localStorage` Event Listeners                                                           | Local WebSockets (`socket.io`)                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Setup Speed**     | **Ultra Fast** (Instantiated in 1 line of native JS)                                              | **Fast** (Requires handling event bindings carefully)                                    | **Slow** (Requires setting up a local Node/Express or Next.js custom server)        |
| **API Complexity**  | **Low** (`postMessage` and `onmessage` callback bindings)                                         | **Medium** (Requires dummy updates to break cache or deduplicate entries)                | **High** (Requires handling handshakes, reconnections, and state stores)            |
| **Latency Profile** | **Near-Zero** (< 2ms; direct processing memory bus transfer)                                      | **Low** (~5–15ms; disk serialization overhead)                                           | **Low-Medium** (~10–30ms; network stack loopback processing)                        |
| **Pros**            | Structured clone algorithm allows native transmission of complex nested object payloads directly. | Simple fallback; acts as a permanent persistent cache if the display window is reloaded. | Bidirectional capabilities; can scale up if you add external cloud clients later.   |
| **Cons**            | Completely non-persistent; if a window reloads, it loses historical frames unless requested.      | Stringification boundaries require serializing payloads; pollutes local storage frames.  | Introduces a potential single point of failure; requires a running backend process. |

> **Verdict:** The [Broadcast Channel API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) is the ideal candidate for a rapid 2-to-3-day sprint. It delivers immediate rendering changes natively without extra third-party dependencies.

---

## 2. Next.js Architecture Blueprint

To ensure clean isolation between the operator's viewport and the presentation layout, organize Next.js into separate routes using the App Router. The shared system dependencies remain encapsulated in custom React hooks.

```text
src/
├── app/
│   ├── layout.tsx             # Global HTML wrapper
│   ├── control/
│   │   ├── page.tsx           # Host Control Panel Dashboard
│   │   └── layout.tsx         # Dashboard specific headers/view boundaries
│   └── projector/
│       ├── page.tsx           # Clean canvas optimized for secondary monitor
│       └── layout.tsx         # Immersive layout (overflow-hidden, dark theme)
├── hooks/
│   └── usePodcastChannel.ts   # Shared state-sync hook wrapping BroadcastChannel
└── types/
    └── index.ts               # Shared payload TypeScript interfaces

```

### Shared Type Interfaces (`src/types/index.ts`)

```typescript
export type SystemState = "idle" | "transitioning" | "typing";

export interface BroadcastPayload {
  state: SystemState;
  promptText?: string;
  responseText?: string;
  timestamp: number;
}
```

### State-Sync Hook (`src/hooks/usePodcastChannel.ts`)

```typescript
import { useEffect, useRef, useCallback } from "react";
import { BroadcastPayload } from "@/types";

const CHANNEL_NAME = "pertu_mi_production_stream";

export function usePodcastChannel(
  onMessageReceived?: (data: BroadcastPayload) => void,
) {
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

  const broadcast = useCallback(
    (payload: Omit<BroadcastPayload, "timestamp">) => {
      if (channelRef.current) {
        channelRef.current.postMessage({
          ...payload,
          timestamp: Date.now(),
        });
      }
    },
    [],
  );

  return { broadcast };
}
```

---

## 3. Framer Motion Code Snippet

The presentation view component manages the sequence states (`idle`, `transitioning`, and `typing`). It features an automated character-by-character typewriter effect that runs without manual tick clocks.

```tsx
// src/app/projector/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePodcastChannel } from "@/hooks/usePodcastChannel";
import { SystemState, BroadcastPayload } from "@/types";

export default function ProjectorDisplay() {
  const [viewState, setViewState] = useState<SystemState>("idle");
  const [displayData, setDisplayData] = useState<
    Omit<BroadcastPayload, "timestamp">
  >({
    state: "idle",
  });
  const [typedResponse, setTypedResponse] = useState("");

  // Handle incoming commands from Host Dashboard
  usePodcastChannel((payload) => {
    if (payload.state === "transitioning") {
      setViewState("transitioning");
      setDisplayData(payload);
      setTypedResponse("");

      // Simulate duration for screen transition/intro wipe before typing
      setTimeout(() => {
        setViewState("typing");
      }, 1200);
    } else if (payload.state === "idle") {
      setViewState("idle");
    }
  });

  // Typewriter effect execution loop
  useEffect(() => {
    if (viewState !== "typing" || !displayData.responseText) return;

    let currentIndex = 0;
    const fullText = displayData.responseText;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedResponse((prev) => prev + fullText.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 25); // Target execution speed (~40 char/sec)

    return () => clearInterval(interval);
  }, [viewState, displayData.responseText]);

  return (
    <main className="relative w-screen h-screen bg-neutral-950 text-white overflow-hidden flex items-center justify-center font-sans select-none">
      <AnimatePresence mode="wait">
        {/* IDLE STATE: Ambient Floating Brand Elements */}
        {viewState === "idle" && (
          <motion.div
            key="idle-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-7xl font-light tracking-widest text-neutral-400 uppercase"
            >
              Pertu Mi
            </motion.div>
            <span className="text-xs tracking-widest text-neutral-600 uppercase">
              Ambient Production Node
            </span>
          </motion.div>
        )}

        {/* TRANSITION STATE: Abstract Geometric Shutter/Scale Intro */}
        {viewState === "transitioning" && (
          <motion.div
            key="transition-view"
            className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium px-12 text-center max-w-4xl italic"
            >
              "{displayData.promptText}"
            </motion.div>
          </motion.div>
        )}

        {/* ACTIVE STATE: Broadcast Content Block */}
        {viewState === "typing" && (
          <motion.div
            key="active-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-6xl px-16 flex flex-col justify-start items-start gap-8"
          >
            <div className="text-sm uppercase tracking-widest text-neutral-500 font-semibold border-b border-neutral-800 pb-2 w-full">
              Live Response Broadcast
            </div>
            <div className="text-4xl font-normal leading-relaxed text-neutral-100 min-h-[400px] whitespace-pre-wrap selection:bg-neutral-800">
              {typedResponse}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "steps(2)",
                }}
                className="inline-block w-3 h-8 bg-amber-500 ml-1 transform translate-y-1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
```

---

## 4. macOS Operator & Window Management Guide

### Manual Placement vs. Window Management API

While Chrome supports the modern [Window Management API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window_Management_API) (formerly Multi-Screen Window Placement API) via `window.getScreenDetails()`, it introduces runtime risk for a production event with a tight 3-day turnaround:

- It requires explicit user permission prompts.
- Coordinate configurations on macOS can shift depending on whether the laptop display is open or closed.
- Safari does not yet fully support the API.

> **Production Recommendation:** For a reliable, zero-boilerplate local deployment, use a dedicated **manual dual-window approach** combined with tailored hardware settings.

### Step-by-Step Production Optimization

#### 1. Configure macOS Mission Control

By default, macOS creates distinct workspace arrangements for separate screens, which can show menu bars or cause window clipping.

- Open **System Settings > Desktop & Dock**.
- Scroll down to the Mission Control section.
- **Turn off** the setting for **"Displays have separate Spaces"**.
- _Note: This requires logging out and back into macOS to apply._

```
[ Laptop Monitor (Built-in) ]       [ Projector / Secondary Display ]
+---------------------------+       +-------------------------------+
|  /control dashboard       | ----> |  /projector canvas            |
|  (Contains input form     | Drag  |  (Hit Cmd+Shift+F inside      |
|  & trigger controls)      | Tab   |   Chrome to hide window UI)   |
+---------------------------+       +-------------------------------+

```

#### 2. Remove Browser Chrome (UI Overhead)

To turn the secondary monitor into a clean video canvas without address bars or bookmarks tab structures:

1. Open Google Chrome and navigate to `http://localhost:3000/projector`.
2. Drag that specific tab onto the secondary screen/projector output.
3. Press **`Cmd + Shift + F`** to toggle **Chrome Presentation Mode** (this hides the window control bounds and URL bar entirely on macOS).
4. Do not use standard macOS native green-button fullscreen tiling, as it may blank out your main display's active view.

#### 3. Control Window Focus and System Sleep

- Prevent display dimming mid-podcast by opening the macOS Terminal and spinning up an assertion instance:

```bash
caffeinate -dim

```

- Ensure Chrome handles background tabs efficiently. To keep the projector view updating smoothly when clicking away on the host dashboard, disable energy saving optimizations by navigating to `chrome://flags/#calculate-native-win-occlusion` and toggling it to **Disabled**.
