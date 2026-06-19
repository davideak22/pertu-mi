# Product Requirements Document (PRD)

This document contains the functional features, user journeys, constraints, and success definitions extracted from the core Product Requirements.

---

## 🎯 Vision & Goals
- **Product Name**: Pertu MI Ai
- **One-Line Summary**: A local-first browser-based multi-screen display system that uses native browser APIs to sync the operator control dashboard with a presentation canvas in near-zero latency (< 5ms) without a web server back-end.
- **Problem Statement**: Podcast operators need a reliable, latency-free method to sync dynamic prompt and response texts from their control laptop to a secondary presenter or projector screen during live recordings. Existing server-reliant multi-screen tools introduce network latency, setup overhead, and reliability risks for live events.

---

## 👥 Primary User Persona
- **Dave (The Live Producer)**: Age 25–40, running a tech/discussion podcast. Comfortable with browser presentation modes, local dev tools, and simple CLI commands.
- **Frustrations**: Studio sync delays, network dependency dropout issues, and clunky manual presentation slides.

---

## 📖 Primary User Story
> Dave is setting up his podcast studio. He opens the **Pertu MI Ai** dashboard on his laptop and opens the projector URL on the second display. When he wants to show a reference prompt and response to his guest, he pastes the text into the control dashboard and hits "Broadcast". Instantly, the guest's screen transitions cleanly from a floating idle logo to a striking prompt card, then types out the response character by character. The guest reads it, comments on it, and Dave resets the view once done.

---

## 📋 Feature Breakdown

### 🌟 Must-Have MVP Features
1. **Host Control Dashboard (`/control`)**
   - Standard text input fields for "Prompt" and "Response".
   - **Broadcast Button**: Transmits active fields and transitions the projector.
   - **Reset / Idle Button**: Returns the projector to standby state.
   - **Live State Indicator**: Reflects current active broadcast state.
2. **Projector Presentation View (`/projector`)**
   - Clean, fullscreen canvas optimized for secondary monitor presentation.
   - **Idle State**: Floating ambient logo/text animation.
   - **Transitioning State**: Liquid-smooth geometric slide-in displaying prompt.
   - **Typing State**: Renders response text character-by-character at 25ms intervals with a blinking amber caret.
3. **Zero-Latency Sync Channel**
   - Leverages browser-native `BroadcastChannel` for memory-level data passing.
   - Target sync latency under 5 milliseconds.

### ⏳ Future / Nice-To-Have Features (Deferred)
- **Live AI Generation**: Feed prompt inputs directly to LLM APIs (keeps MVP local and fast).
- **Session History Log**: Logs previous broadcast cards locally.
- **Remote WebSockets Hook**: Connects displays located on separate networks.

---

## 🎨 UI/UX & Design Guidelines
- **Atmosphere**: Premium, high-contrast local-production dashboard. Dark themes optimized for camera settings to prevent glare.
- **Palette**:
  - **Slate Gray**: Base dark backgrounds.
  - **Blue/Navy**: Indigo gradient overlays.
  - **White**: Text elements.
  - **Amber/Orange**: Cursor highlight.
- **Feel**: Animations must feel organic and liquid, leveraging Framer Motion spring physics.

---

## 📈 Success Metrics
- **Broadcast Reliability**: 100% success rate without crashes or sync drops during a 2-hour podcast recording.
- **Latency Budget**: State synchronization takes less than 5ms.
- **Boot Metric**: Initializing development environment takes less than 30 seconds.
- **Physical Integration**: Screen looks native under browser Presentation Mode (`Cmd + Shift + F`).
