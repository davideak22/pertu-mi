/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { usePodcastChannel } from "@/hooks/usePodcastChannel";
import { BroadcastPayload } from "@/types";

// SVG Icons for AI Models
const ChatGPTIcon = () => (
  <svg className="w-8 h-8 text-[#19c37d]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.7,11.3c0.1-0.7,0-1.4-0.3-2.1c-0.4-0.9-1.1-1.6-2.1-2c-0.2-0.1-0.4-0.2-0.7-0.2c0-0.5-0.1-1-0.3-1.5 c-0.4-1.1-1.3-1.9-2.4-2.3C15.1,3,14.2,3,13.4,3.2c-0.5-0.3-1.1-0.5-1.7-0.6C10.5,2.4,9.3,2.7,8.4,3.4C8,3.7,7.6,4.1,7.3,4.6 C7.1,4.5,6.8,4.5,6.5,4.5C5.4,4.6,4.4,5.2,3.8,6.2C3.5,6.7,3.3,7.3,3.3,8c-0.4,0.1-0.9,0.3-1.3,0.6C1.1,9.2,0.5,10.2,0.3,11.3 c-0.1,0.7,0,1.4,0.3,2.1c0.4,0.9,1.1,1.6,2.1,2c0.2,0.1,0.4,0.2,0.7,0.2c0,0.5,0.1,1,0.3,1.5c0.4,1.1,1.3,1.9,2.4,2.3 c0.8,0.3,1.7,0.3,2.5,0.1c0.5,0.3,1.1,0.5,1.7,0.6c1.2,0.2,2.4-0.1,3.3-0.8c0.4-0.3,0.8-0.7,1.1-1.2c0.2,0.1,0.5,0.1,0.8,0.1 c1.1-0.1,2.1-0.7,2.7-1.7c0.3-0.5,0.5-1.1,0.5-1.8c0.4-0.1,0.9-0.3,1.3-0.6C20.9,13.1,21.5,12.2,21.7,11.3 M12.8,20.1 c-0.7,0-1.4-0.3-1.8-0.8l-0.4-0.5l0.6-0.3c1.9-1.1,3.1-3,3.1-5.2v-0.6h0.7c1,0,1.9,0.6,2.2,1.5c0.2,0.6,0.1,1.3-0.3,1.8 L16.4,19c-0.9,0.7-2.1,1.1-3.6,1.1M5.6,16.5c-0.5-0.6-0.6-1.4-0.3-2l0.3-0.6l0.5,0.4c1.6,1.4,3.7,1.9,5.8,1.4v0.7 c0,1-0.5,1.9-1.4,2.3c-0.6,0.3-1.3,0.3-1.9,0L6,17.2c-0.2-0.2-0.3-0.4-0.4-0.7M4,10.6c0.2-0.6,0.7-1.1,1.4-1.3l0.6-0.2l0.1,0.6 c0.3,2.3,1.7,4.3,3.7,5.4l-0.5,0.3C8.3,15.8,7.3,16,6.3,15.6c-0.6-0.2-1.1-0.7-1.3-1.3L4,12.3c-0.1-0.5-0.1-1.1,0-1.7M11.2,3.9 c0.7,0,1.4,0.3,1.8,0.8l0.4,0.5l-0.6,0.3C10.9,6.6,9.7,8.6,9.7,10.7v0.6H9c-1,0-1.9-0.6-2.2-1.5c-0.2-0.6-0.1-1.3,0.3-1.8L7.6,5 c0.9-0.7,2.1-1.1,3.6-1.1M18.4,7.5c0.5,0.6,0.6,1.4,0.3,2l-0.3,0.6l-0.5-0.4c-1.6-1.4-3.7-1.9-5.8-1.4v-0.7c0-1,0.5-1.9,1.4-2.3 c0.6-0.3,1.3-0.3,1.9,0L18,6.8c0.2,0.2,0.3,0.4,0.4,0.7M20,13.4c-0.2,0.6-0.7,1.1-1.4,1.3l-0.6,0.2l-0.1-0.6c-0.3-2.3-1.7-4.3-3.7-5.4 l0.5-0.3c1.1-0.4,2.1-0.5,3.1-0.1c0.6,0.2,1.1,0.7,1.3,1.3l1,1.9c0.1,0.6,0.1,1.2,0,1.7M12,14c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2 c1.1,0,2,0.9,2,2C14,13.1,13.1,14,12,14" />
  </svg>
);

const ClaudeIcon = () => (
  <svg className="w-8 h-8 text-[#d9775f]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10,0,0,0,4.25,18.39l1.42-2.45A7.17,7.17,0,0,1,12,4.83a7.17,7.17,0,0,1,6.33,11.11l1.42,2.45A10,10,0,0,0,12,2ZM9,11h6a1,1,0,0,1,0,2H9a1,1,0,0,1,0-2ZM6.3,19.3A10,10,0,0,0,12,22a10,10,0,0,0,5.7-2.7l-1.42-2.45A7.17,7.17,0,0,1,12,19.17a7.17,7.17,0,0,1-4.28-2.32Z" />
  </svg>
);

const GeminiIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9b51e0" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    <path d="M12 2C12 2 12.5 8.5 14.5 10.5C16.5 12.5 22 13 22 13C22 13 16.5 13.5 14.5 15.5C12.5 17.5 12 22 12 22C12 22 11.5 17.5 9.5 15.5C7.5 13.5 2 13 2 13C2 13 7.5 12.5 9.5 10.5C11.5 8.5 12 2 12 2Z" fill="url(#gemini-grad)" />
  </svg>
);

const RobotIcon = () => (
  <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M12 2v4M12 5H7M12 5h5M8 15h.01M16 15h.01" />
  </svg>
);

function renderModelIcon(modelName?: string) {
  const normalized = (modelName || "").trim().toLowerCase();
  if (normalized.includes("chatgpt")) {
    return <ChatGPTIcon />;
  }
  if (normalized.includes("claude")) {
    return <ClaudeIcon />;
  }
  if (normalized.includes("gemini")) {
    return <GeminiIcon />;
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
    <main className="projector-canvas relative w-screen h-screen overflow-hidden flex flex-col items-center justify-between py-10 bg-bg-deep text-foreground select-none">
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
          </svg>
        )}
      </button>

      {/* Persistent Brand Header on Active States */}
      <div className="h-20 w-full flex items-center justify-center relative z-20">
        <AnimatePresence>
          {payload.state !== "idle" && (
            <motion.div
              key="active-logo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <img
                src="/logo.png"
                alt="Pertu Mi Logo"
                className="w-[260px] h-auto object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen layout anim transitions */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10 overflow-hidden">
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
                  <div className="text-2xl sm:text-4xl md:text-5xl font-semibold leading-relaxed text-slate-200 font-mono whitespace-pre-wrap">
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

      {/* Bottom Spacer Area for visual balance */}
      <div className="h-20 w-full" />
    </main>
  );
}
