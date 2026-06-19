/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, isValidElement, cloneElement, ReactNode, ReactElement } from "react";
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

function injectCursor(children: ReactNode, isTypingComplete: boolean): ReactNode {
  if (isTypingComplete) return children;

  if (typeof children === "string") {
    if (children.includes("[CURSOR]")) {
      const parts = children.split("[CURSOR]");
      return (
        <>
          {parts[0]}
          <span className="typewriter-cursor" />
          {parts[1]}
        </>
      );
    }
    return children;
  }

  if (Array.isArray(children)) {
    const newChildren = [...children];
    for (let i = newChildren.length - 1; i >= 0; i--) {
      const child = newChildren[i];
      const result = injectCursor(child, isTypingComplete);
      if (result !== child) {
        newChildren[i] = result;
        return newChildren;
      }
    }
    return children;
  }

  if (isValidElement(children)) {
    const element = children as ReactElement<{ children?: ReactNode }>;
    if (element.props && "children" in element.props) {
      return cloneElement(element, {
        children: injectCursor(element.props.children, isTypingComplete),
      });
    }
  }

  return children;
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
  const isTypingComplete = typedLength >= (payload.responseText || "").length;
  const typedResponseWithCursor = isTypingComplete ? typedResponse : typedResponse + "[CURSOR]";

  // Listen to the shared broadcast channel
  usePodcastChannel((data) => {
    const cleanText = (text: string) => {
      const lines = text.split("\n").map((line) => line.trim().replace(/[ \t]+/g, " "));
      const cleanedLines: string[] = [];
      let isPreviousLineEmpty = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === "") {
          if (!isPreviousLineEmpty && i > 0 && i < lines.length - 1) {
            cleanedLines.push("");
            isPreviousLineEmpty = true;
          }
        } else {
          cleanedLines.push(line);
          isPreviousLineEmpty = false;
        }
      }

      return cleanedLines.join("\n");
    };
    setPayload({
      ...data,
      promptText: cleanText(data.promptText || ""),
      responseText: cleanText(data.responseText || ""),
    });
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
    let ticks = 0;
    let currentLength = 0;
    let timeoutId: NodeJS.Timeout;
    
    const tick = () => {
      // Delay starts at 90ms and decreases very slowly by 0.4ms per tick to a 15ms minimum
      const delay = Math.max(15, 90 - ticks * 0.4);
      
      // Continuous linear acceleration curve:
      // Holds at 1 char/tick for the first 40 ticks (walking -> running),
      // then transitions gradually to bike, car, bullet train, and flight (ticks 40+)
      // Step size increases by 1 character every 60 ticks (50% slower acceleration)
      const accelerationTicks = Math.max(0, ticks - 40);
      const charsToAdd = Math.floor(1 + accelerationTicks / 60);
      
      ticks++;
      currentLength = Math.min(targetLength, currentLength + charsToAdd);
      setTypedLength(currentLength);

      if (currentLength < targetLength) {
        timeoutId = setTimeout(tick, delay);
      }
    };

    // Start typewriter loop
    timeoutId = setTimeout(tick, 90);

    return () => clearTimeout(timeoutId);
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
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-xl glass-panel border border-slate-border text-slate-muted hover:text-white transition-all cursor-pointer opacity-15 hover:opacity-100 flex items-center justify-center shadow-lg"
          title="Enter Fullscreen Mode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h-4.5m-4.5 0L9 15M20.25 3.75v-4.5m0 4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
          </svg>
        </button>
      )}

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

          {/* Combined Session View: Active Presentation (Transitioning & Typing) */}
          {payload.state !== "idle" && (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[90vw] px-8 flex flex-col gap-10"
            >
              {/* Prompt Card */}
              <div className="w-full flex justify-end">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 85, damping: 17 }}
                  className={`glass-panel border border-slate-border shadow-2xl w-full max-w-[85%] ${
                    payload.state === "transitioning"
                      ? "p-10 md:p-12 rounded-3xl rounded-br-none"
                      : "p-6 md:p-8 rounded-2xl rounded-br-none opacity-80"
                  }`}
                >
                  <motion.div layout="position" className="relative w-full">
                    {/* Large Intro Text (Transitioning State) */}
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{
                        opacity: payload.state === "transitioning" ? 1 : 0,
                        y: payload.state === "transitioning" ? 0 : -10,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className={payload.state === "transitioning" ? "w-full" : "absolute inset-x-0 top-0 pointer-events-none"}
                    >
                      <span className="font-bold tracking-[0.2em] uppercase block mb-2 font-sans text-sm md:text-base text-indigo-primary">
                        Prompt Reference
                      </span>
                      <p className="font-extrabold text-white leading-snug font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                        {payload.promptText || "No prompt text provided."}
                      </p>
                    </motion.div>

                    {/* Small Minimized Text (Typing State) */}
                    <motion.div
                      layout="position"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: payload.state === "typing" ? 1 : 0,
                        y: payload.state === "typing" ? 0 : 10,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className={payload.state === "typing" ? "w-full" : "absolute inset-x-0 top-0 pointer-events-none"}
                    >
                      <span className="font-bold tracking-[0.2em] uppercase block mb-2 font-sans text-xs text-slate-muted">
                        Prompt
                      </span>
                      <p className="font-extrabold text-white leading-snug font-sans text-3xl sm:text-4xl md:text-5xl">
                        {payload.promptText || "No prompt text provided."}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Response Section */}
              <AnimatePresence>
                {payload.state === "typing" && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
                    className="w-full flex justify-start items-start gap-4 md:gap-6"
                  >
                    {/* Round Avatar Indicator */}
                    <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-border flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden backdrop-blur-md">
                      {renderModelIcon(payload.modelName)}
                    </div>

                    {/* Response Card content bubble (ChatGPT model response style) */}
                    <div className="flex-1 glass-panel p-12 md:p-14 rounded-3xl rounded-bl-none border border-indigo-primary/20 shadow-[0_0_60px_hsla(var(--primary)/0.04)]">
                      <div className="flex items-center gap-3 mb-4 border-b border-slate-border/30 pb-3">
                        <span className="text-sm font-bold tracking-[0.2em] text-accent-amber uppercase font-sans">
                          {payload.modelName || "AI Assistant"}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-indigo-primary/20 text-indigo-primary uppercase font-sans border border-indigo-primary/30">
                          Response
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug text-slate-200 font-mono whitespace-pre-wrap">
                        <div className="markdown-content inline-block w-full">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{injectCursor(children, isTypingComplete)}</p>,
                              li: ({ children }) => <li className="mb-1 last:mb-0">{injectCursor(children, isTypingComplete)}</li>,
                              h1: ({ children }) => <h1 className="text-3xl font-bold my-2">{injectCursor(children, isTypingComplete)}</h1>,
                              h2: ({ children }) => <h2 className="text-2xl font-bold my-2">{injectCursor(children, isTypingComplete)}</h2>,
                              h3: ({ children }) => <h3 className="text-xl font-bold my-2">{injectCursor(children, isTypingComplete)}</h3>,
                            }}
                          >
                            {typedResponseWithCursor}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
