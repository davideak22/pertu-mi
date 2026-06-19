export type SystemState = "idle" | "transitioning" | "typing";

export interface BroadcastPayload {
  state: SystemState;
  promptText?: string;
  responseText?: string;
  modelName?: string;
  timestamp: number;
}
