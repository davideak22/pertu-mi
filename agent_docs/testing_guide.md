# Verification & Studio Testing Guide

This guide describes how to verify synchronization latency, configure browser execution parameters, and lock presentation displays for the **Pertu MI Ai** system during live podcast recordings.

---

## 1. Local Sync & Latency Verification

Because the system operates directly on the browser's local memory bus using the `BroadcastChannel` API, state changes synchronize in under **2 milliseconds**.

### Test Steps:
1. Open the project root directory and spin up the local server:
   ```bash
   npm run dev
   ```
2. Open Chrome on the primary laptop screen and go to the Host Control Panel:
   [http://localhost:3000/control](http://localhost:3000/control)
3. Open another Chrome window, drag it onto the secondary projector screen, and go to the Presenter Canvas:
   [http://localhost:3000/projector](http://localhost:3000/projector)
4. Click **⚡ Sync Latency** in the Control dashboard templates, then hit **🚀 Broadcast Stream**.
5. Observe the latency on the presenter window. The transition wipe and typewriter response should start instantly.

---

## 2. Preventing macOS Display Sleep (`caffeinate`)

During long recordings, macOS power savers may put the secondary monitor to sleep. To temporarily block CPU and display idle transitions:

1. Open your macOS Terminal.
2. Run the command:
   ```bash
   caffeinate -dim
   ```
   *Explanation: `-d` prevents display sleep, `-i` prevents system idle sleep, and `-m` prevents disk sleep.*
3. Leave this terminal window running in the background. Press `Ctrl + C` to exit once the recording session ends.

---

## 3. Disabling Chrome Background Throttling

By default, modern Chromium browsers throttle the rendering and animation frames of background tabs or occluded windows to save battery. If you click away from the `/projector` window to work on the `/control` dashboard, the animations on the presenter display might stutter or lag.

### Configuration Steps:
1. Open Google Chrome.
2. In the URL bar, search for:
   ```text
   chrome://flags/#calculate-native-win-occlusion
   ```
3. Locate the setting named **Calculate window occlusion on Windows/Mac** (or similar occlusion flag depending on your Chrome version).
4. Change its value from **Default** to **Disabled**.
5. Click the **Relaunch** button in the bottom-right corner to restart Chrome and apply settings.
6. Animations on the projector display will now remain locked at a fluid 60fps, even when Chrome is running in the background or off-focus.

---

## 4. Full Presentation Mode

To present a clean, hardware-like display free from browser addresses, tabs, and menu bounds:

1. Click the floating **Fullscreen** button in the top-right corner of the projector screen (`/projector`).
2. Alternatively, click the presenter window and press:
   - macOS: `Cmd + Shift + F`
   - Windows/Linux: `F11`
3. Hovering in the top-right corner will reveal the exit button, or you can press `Esc` to return to windowed mode.
