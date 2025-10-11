export interface OpenAiAppsSdk {
  callTool<TInput extends Record<string, unknown>, TResult>(name: string, payload: {
    arguments: TInput;
    mode?: "background" | "sync";
  }): Promise<TResult>;
  requestDisplayMode(mode: { mode: "inline" | "fullscreen" | "pip" }): Promise<void>;
  setWidgetState(state: Record<string, unknown>): Promise<void>;
}

declare global {
  interface Window {
    openai?: OpenAiAppsSdk;
  }
}

export function getAppsSdk(): OpenAiAppsSdk {
  if (!window.openai) {
    throw new Error("window.openai is not available. Ensure the widget runs inside Apps SDK context.");
  }
  return window.openai;
}
