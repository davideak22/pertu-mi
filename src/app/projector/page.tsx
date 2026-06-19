"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePodcastChannel } from "@/hooks/usePodcastChannel";
import { BroadcastPayload } from "@/types";

export default function ProjectorPage() {
  const [payload, setPayload] = useState<BroadcastPayload>({
    state: "idle",
    promptText: "",
    responseText: "",
    timestamp: 0,
  });
  
  const [typedResponse, setTypedResponse] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen to the shared broadcast channel
  usePodcastChannel((data) => {
    setPayload(data);
    setTypedResponse(""); // Reset typed text on new broadcast message receipt
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

    let index = 0;
    const text = payload.responseText;
    
    const intervalId = setInterval(() => {
      setTypedResponse((prev) => prev + text.charAt(index));
      index++;
      
      if (index >= text.length) {
        clearInterval(intervalId);
      }
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
    <main className="projector-canvas relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-deep text-foreground select-none">
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

      {/* Screen layout anim transitions */}
      <AnimatePresence mode="wait">
        {/* State 1: Idle Ambient View */}
        {payload.state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center flex flex-col items-center"
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
              <Image
                src="/logo.png"
                alt="Pertu Mi Logo"
                width={350}
                height={120}
                className="object-contain"
                priority
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
            className="relative z-10 w-full max-w-4xl px-8"
          >
            <motion.div
              layoutId="prompt-card"
              className="glass-panel p-12 rounded-3xl border border-slate-border shadow-2xl"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-indigo-primary uppercase block mb-3 font-sans">
                Prompt Reference
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-sans">
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
            className="relative z-10 w-full max-w-4xl px-8 flex flex-col gap-8"
          >
            {/* Prompt card minimised at top */}
            <motion.div
              layoutId="prompt-card"
              className="glass-panel p-6 rounded-2xl border border-slate-border opacity-70"
            >
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-muted uppercase block mb-1 font-sans">
                Prompt
              </span>
              <p className="text-lg font-bold text-white font-sans">
                {payload.promptText || "No prompt text provided."}
              </p>
            </motion.div>

            {/* Response Text typing out dynamically */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
              className="glass-panel p-10 rounded-2xl border border-indigo-primary/20 shadow-[0_0_50px_hsla(var(--primary)/0.05)]"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-accent-amber uppercase block mb-4 font-sans">
                Response Transcript
              </span>
              <p className="text-xl sm:text-2xl font-medium leading-relaxed text-slate-200 font-mono whitespace-pre-wrap">
                {typedResponse}
                <span className="typewriter-cursor" />
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
