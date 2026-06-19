# Tech Stack & Code Patterns

This document details the technologies, libraries, conventions, and implementation examples for Pertu MI Ai.

---

## 🛠️ Technology Stack
- **Frontend Framework**: Next.js (React 19+, Client-Side App Router pages)
- **Styling**: Vanilla CSS (Tailwind is initialized for configuration, but custom, pixel-perfect layouts, fonts, and scrollbars must be styled in `src/app/globals.css`)
- **Animation Engine**: Framer Motion (used for liquid physics-based wipes and animations)
- **Database/Backend**: None (Fully client-side sync via native browser APIs)
- **Sync Protocol**: Browser-native `BroadcastChannel` API (`pertu_mi_production_stream`)

---

## 🚀 Setup Commands
Initialize project locally:
```bash
# Initialize Next.js project template
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install animation utilities
npm install framer-motion

# Run development server
npm run dev
```

---

## 💻 Standard Component Structure
Below is an example structure illustrating how pages interact with the sync channel using React state:

```typescript
// src/app/projector/page.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePodcastChannel } from "@/hooks/usePodcastChannel";
import { BroadcastPayload } from "@/types";

export default function ProjectorPage() {
  const [payload, setPayload] = useState<BroadcastPayload>({
    state: "idle",
    timestamp: Date.now(),
  });

  // Listener receives updates instantly from the broadcast line
  usePodcastChannel((data) => {
    setPayload(data);
  });

  return (
    <main className="projector-canvas">
      <AnimatePresence mode="wait">
        {payload.state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="idle-view"
          >
            <h1>Pertu Mi</h1>
          </motion.div>
        )}
        {payload.state === "transitioning" && (
          <motion.div
            key="transitioning"
            initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="wipe-card"
          >
            <p>{payload.promptText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
```

---

## ⚠️ Error Handling Patterns
Since the app runs locally and state sharing is stateless, we must gracefully handle browser channel initialization errors:

```typescript
// src/hooks/usePodcastChannel.ts
import { useEffect, useRef, useCallback } from "react";
import { BroadcastPayload } from "@/types";

export function usePodcastChannel(onMessage?: (data: BroadcastPayload) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const channel = new BroadcastChannel("pertu_mi_production_stream");
      channelRef.current = channel;

      if (onMessage) {
        channel.onmessage = (event: MessageEvent<BroadcastPayload>) => {
          onMessage(event.data);
        };
      }

      channel.onmessageerror = (err) => {
        console.error("Broadcast Channel deserialization error:", err);
      };

    } catch (e) {
      console.error("Failed to initialize BroadcastChannel. Fallback to localStorage:", e);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [onMessage]);

  const broadcast = useCallback((payload: Omit<BroadcastPayload, "timestamp">) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          ...payload,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Failed to post message:", err);
      }
    }
  }, []);

  return { broadcast };
}
```

---

## 🏷️ Naming Conventions
- **Files**:
  - React components & routes: `page.tsx`, `layout.tsx` (App Router structure).
  - Custom hooks: `usePodcastChannel.ts` (camelCase prefix with `use`).
  - Helper files: `types.ts`, `constants.ts` (lowercase, singular).
- **TypeScript**:
  - Interfaces/Types: Named in PascalCase (e.g. `BroadcastPayload`, `SystemState`).
  - Types are declared inside `src/types/index.ts` to ensure consistency.
- **Styling Rules**:
  - Class selectors: kebab-case (e.g., `.projector-canvas`, `.wipe-card`).
  - Dark-mode variable declarations: root-level variables prefixed with `--` (e.g., `--bg-slate`).
