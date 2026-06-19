import { useEffect, useRef, useCallback } from "react";
import { BroadcastPayload } from "@/types";

const CHANNEL_NAME = "pertu_mi_production_stream";

export function usePodcastChannel(onMessage?: (data: BroadcastPayload) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep callback ref updated with the latest handler
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event: MessageEvent<BroadcastPayload>) => {
        if (onMessageRef.current) {
          onMessageRef.current(event.data);
        }
      };

      channel.onmessageerror = (err) => {
        console.error("Broadcast Channel deserialization error:", err);
      };

    } catch (e) {
      console.error("Failed to initialize BroadcastChannel:", e);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

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
    } else {
      // If hook is used for broadcast-only and useEffect hasn't run or is in SSR,
      // try to initialize channel temporarily or log error.
      // Since it's client-only inside useEffect, channelRef will be populated.
      // But we can fallback to temporary local creation if channelRef is null in browser.
      if (typeof window !== "undefined") {
        try {
          const tempChannel = new BroadcastChannel(CHANNEL_NAME);
          tempChannel.postMessage({
            ...payload,
            timestamp: Date.now(),
          });
          tempChannel.close();
        } catch (err) {
          console.error("Failed to broadcast on fallback channel:", err);
        }
      }
    }
  }, []);

  return { broadcast };
}
