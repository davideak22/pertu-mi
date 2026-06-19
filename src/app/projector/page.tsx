/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { usePodcastChannel } from "@/hooks/usePodcastChannel";
import { BroadcastPayload } from "@/types";

// SVG Icons for AI Models
const RobotIcon = () => (
  <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M12 2v4M12 5H7M12 5h5M8 15h.01M16 15h.01" />
  </svg>
);

function renderModelIcon(modelName?: string) {
  const normalized = (modelName || "").trim().toLowerCase();
  if (normalized.includes("chatgpt")) {
    return <img src="/chatgpt.svg" alt="ChatGPT" className="w-8 h-8 object-contain" />;
  }
  if (normalized.includes("claude")) {
    return <img src="/claude.svg" alt="Claude" className="w-8 h-8 object-contain" />;
  }
  if (normalized.includes("gemini")) {
    return <img src="/gemini.png" alt="Gemini" className="w-8 h-8 object-contain" />;
  }
  return <RobotIcon />;
}

export default function ProjectorPage() {
  const [payload, setPayload] = useState<BroadcastPayload>({
    state: "idle",
    promptText: "",
    responseText: "",
    timestamp: 0,
  });
  
  const [typedLength, setTypedLength] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Compute sliced text for presentation
  const typedResponse = (payload.responseText || "").slice(0, typedLength);

  // Listen to the shared broadcast channel
  usePodcastChannel((data) => {
    setPayload(data);
    setTypedLength(0); // Reset typed count on new broadcast receipt
  });

  // Track browser fullscreen changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Typewriter effect for responseText in the "typing" state
  useEffect(() => {
    if (payload.state !== "typing" || !payload.responseText) {
      return;
    }

    const targetLength = payload.responseText.length;
    
    const intervalId = setInterval(() => {
      setTypedLength((prev) => {
        if (prev < targetLength) {
          return prev + 1;
        }
        clearInterval(intervalId);
        return prev;
      });
    }, 25); // 25ms character output speed

    return () => clearInterval(intervalId);
  }, [payload.state, payload.responseText, payload.timestamp]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen mode:", err);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <main className="projector-canvas relative w-screen h-screen bg-bg-deep text-foreground select-none">
      {/* Background neon ambient glow */}
      <div className="glow-backdrop" />

      {/* Floating Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-xl glass-panel border border-slate-border text-slate-muted hover:text-white transition-all cursor-pointer opacity-15 hover:opacity-100 flex items-center justify-center shadow-lg"
        title={isFullscreen ? "Exit Fullscreen Mode" : "Enter Fullscreen Mode"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v-4.5m0 4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
          </svg>
        )}
      </button>

      {/* Persistent Brand Header on Active States - Top Left Corner */}
      <div className="absolute top-8 left-8 z-30">
        <AnimatePresence>
          {payload.state !== "idle" && (
            <motion.div
              key="active-logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src="/logo.png"
                alt="Pertu Mi Logo"
                className="w-[180px] h-auto object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center Wrapper Container with scrolling support */}
      <div className="min-h-full w-full flex flex-col justify-center items-center py-24 px-6 md:px-12 relative z-10">
        <AnimatePresence mode="wait">
          {/* State 1: Idle Ambient View */}
          {payload.state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center"
            >
              {/* Floating Logo Animation */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-4 drop-shadow-[0_10px_20px_rgba(255,255,255,0.03)]"
              >
                <img
                  src="/logo.png"
                  alt="Pertu Mi Logo"
                  className="w-[350px] h-auto object-contain"
                />
              </motion.div>
              
              <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mt-4 text-xs font-semibold tracking-[0.3em] text-slate-muted uppercase font-sans"
              >
                Awaiting Operator Feed
              </motion.p>
            </motion.div>
          )}

          {/* State 2: Transitioning (Prompt Card Wipe-in Intro) */}
          {payload.state === "transitioning" && (
            <motion.div
              key="transitioning"
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 }}
              animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl px-8 flex justify-end"
            >
              <motion.div
                layoutId="prompt-card"
                className="glass-panel p-10 md:p-12 rounded-3xl rounded-br-none border border-slate-border shadow-2xl max-w-[75%]"
              >
                <span className="text-sm md:text-base font-bold tracking-[0.25em] text-indigo-primary uppercase block mb-4 font-sans">
                  Prompt Reference
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight font-sans">
                  {payload.promptText || "No prompt text provided."}
                </h2>
              </motion.div>
            </motion.div>
          )}

          {/* State 3: Typing (Prompt + Typewriter Response) */}
          {payload.state === "typing" && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-6xl px-8 flex flex-col gap-10"
            >
              {/* Prompt card minimised at top right (ChatGPT user bubble style) */}
              <div className="w-full flex justify-end">
                <motion.div
                  layoutId="prompt-card"
                  className="glass-panel p-6 md:p-8 rounded-2xl rounded-br-none border border-slate-border opacity-80 max-w-[70%] shadow-lg"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-muted uppercase block mb-2 font-sans">
                    Prompt
                  </span>
                  <p className="text-2xl md:text-3xl font-extrabold text-white font-sans leading-snug">
                    {payload.promptText || "No prompt text provided."}
                  </p>
                </motion.div>
              </div>

              {/* Response row: Left avatar column, right transcript bubble column */}
              <div className="w-full flex justify-start items-start gap-4 md:gap-6">
                {/* Round Avatar Indicator */}
                <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-border flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden backdrop-blur-md">
                  {renderModelIcon(payload.modelName)}
                </div>

                {/* Response Card content bubble (ChatGPT model response style) */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
                  className="flex-1 glass-panel p-12 md:p-14 rounded-3xl rounded-bl-none border border-indigo-primary/20 shadow-[0_0_60px_hsla(var(--primary)/0.04)]"
                >
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-border/30 pb-3">
                    <span className="text-sm font-bold tracking-[0.2em] text-accent-amber uppercase font-sans">
                      {payload.modelName || "AI Assistant"}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-indigo-primary/20 text-indigo-primary uppercase font-sans border border-indigo-primary/30">
                      Response
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed text-slate-200 font-mono whitespace-pre-wrap">
                    <div className="markdown-content inline-block">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <span className="inline">{children}</span>,
                        }}
                      >
                        {typedResponse}
                      </ReactMarkdown>
                      <span className="typewriter-cursor" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
