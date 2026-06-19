/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePodcastChannel } from "@/hooks/usePodcastChannel";
import { SystemState } from "@/types";

interface DemoTemplate {
  title: string;
  prompt: string;
  response: string;
}

const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    title: "Sync Latency",
    prompt: "Why is memory sync preferred over WebSockets for local dual-displays?",
    response: "Native memory sync via the BroadcastChannel API transfers state payloads directly on the browser's local RAM bus, resolving in < 2ms latency. WebSockets introduce TCP stack roundtrips and require a running loopback server.",
  },
  {
    title: "Chrome Occlusion",
    prompt: "How do we prevent browser animation throttling in background tabs?",
    response: "Navigate to chrome://flags/#calculate-native-win-occlusion in Google Chrome, select Disabled, and restart. This forces Chrome to render transitions at a locked 60fps, even when the window is clicked off-screen.",
  },
  {
    title: "Camera Design",
    prompt: "Why does the presenter canvas utilize a deep HSL slate scheme?",
    response: "Standard white backgrounds cast severe glares on cameras and presenter faces. Pure black is visually flat. A deep, saturated slate theme (HSL 222/47%/5%) provides optimal contrast without casting reflective glares on set.",
  }
];

export default function ControlPage() {
  const [promptText, setPromptText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [broadcastState, setBroadcastState] = useState<SystemState>("idle");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize the sync hook for broadcasting
  const { broadcast } = usePodcastChannel();

  // Clear timers on component unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleBroadcast = () => {
    // Prevent overlapping timers if clicked repeatedly
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 1. Instantly trigger prompt transition state
    setBroadcastState("transitioning");
    broadcast({
      state: "transitioning",
      promptText,
      responseText,
    });

    // 2. Set timer to automatically transition to typewriter typing state after 1500ms
    timerRef.current = setTimeout(() => {
      setBroadcastState("typing");
      broadcast({
        state: "typing",
        promptText,
        responseText,
      });
      timerRef.current = null;
    }, 1500);
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Return projector and control dashboard to stand-by idle state
    setBroadcastState("idle");
    setPromptText("");
    setResponseText("");
    broadcast({
      state: "idle",
      promptText: "",
      responseText: "",
    });
  };

  const loadTemplate = (template: DemoTemplate) => {
    setPromptText(template.prompt);
    setResponseText(template.response);
  };

  return (
    <main className="relative flex flex-col h-screen overflow-y-auto bg-bg-deep text-foreground font-sans">
      <div className="glow-backdrop" />

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-slate-border glass-panel">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="Pertu MI Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-border text-slate-muted font-sans">
            Host Control
          </span>
        </div>
        <Link href="/projector" target="_blank" className="text-sm font-medium text-slate-muted hover:text-white transition-colors font-sans">
          Open Presenter Screen ↗
        </Link>
      </header>

      {/* Main Panel Content */}
      <section className="relative z-10 flex-1 grid gap-8 p-8 md:grid-cols-3 max-w-7xl mx-auto w-full">
        {/* Left and Middle columns: Control Inputs */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-border bg-slate-panel/50 glass-panel">
            <h2 className="text-lg font-bold mb-4 text-white font-sans">Broadcast Inputs</h2>
            
            {/* Quick Templates Panel */}
            <div className="mb-6 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-muted mr-1.5">
                Load Demo:
              </span>
              {DEMO_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  onClick={() => loadTemplate(tmpl)}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-slate-800 border border-slate-border text-slate-300 hover:text-indigo-primary hover:border-indigo-primary/40 transition-colors cursor-pointer"
                >
                  ⚡ {tmpl.title}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              {/* Prompt input field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-muted font-sans">
                  Prompt Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Why is native browser memory sync faster than WebSockets?"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-border bg-bg-deep text-white placeholder-slate-muted/50 focus:outline-none focus:border-indigo-primary/80 focus:ring-1 focus:ring-indigo-primary/80 transition-all font-sans"
                />
              </div>

              {/* Response text area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-muted font-sans">
                  Response Text
                </label>
                <textarea
                  rows={6}
                  placeholder="e.g. It operates on the browser's local memory bus instead of traversing the TCP/IP stack or requesting external network servers..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-border bg-bg-deep text-white placeholder-slate-muted/50 focus:outline-none focus:border-indigo-primary/80 focus:ring-1 focus:ring-indigo-primary/80 transition-all font-mono resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBroadcast}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-center btn-primary cursor-pointer font-sans"
            >
              🚀 Broadcast Stream
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 rounded-xl font-semibold btn-secondary cursor-pointer font-sans"
            >
              🔄 Reset to Standby
            </button>
          </div>
        </div>

        {/* Right column: Status Monitor */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-slate-border bg-slate-panel/50 glass-panel flex-1 flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-white font-sans">System Status</h2>
            
            <div className="flex-1 flex flex-col justify-between">
              {/* Broadcast Channel Status Indicator */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-deep border border-slate-border">
                  <span className="text-sm text-slate-muted font-sans">Local Sync Bus</span>
                  <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-sans">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    CONNECTED
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-deep border border-slate-border">
                  <span className="text-sm text-slate-muted font-sans">Active State</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={broadcastState}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase font-sans ${
                        broadcastState === "idle" ? "bg-slate-700 text-slate-300" :
                        broadcastState === "transitioning" ? "bg-indigo-primary/20 text-indigo-primary border border-indigo-primary/30" :
                        "bg-accent-amber/20 text-accent-amber border border-accent-amber/30"
                      }`}
                    >
                      {broadcastState}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Status information info */}
              <div className="mt-8 p-4 rounded-lg bg-indigo-primary/5 border border-indigo-primary/10 text-xs text-slate-muted leading-relaxed font-sans">
                <span className="font-bold text-indigo-primary block mb-1">Local Memory Bus</span>
                This panel is connected to the single-origin `BroadcastChannel` line. Updates sync to the presenter display tab in near-zero latency (&lt; 2ms).
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
