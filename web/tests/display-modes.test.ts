import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { bootstrapWidget } from "../src/index.js";
import type { OpenAiAppsSdk } from "../src/types/openai.js";

async function waitForRender() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function createSdk(overrides: Partial<OpenAiAppsSdk>): OpenAiAppsSdk {
  return {
    async callTool<TInput extends Record<string, unknown>, TResult>() {
      return undefined as TResult;
    },
    async requestDisplayMode() {
      return undefined;
    },
    async setWidgetState() {
      return undefined;
    },
    ...overrides
  };
}

test("inline card requests fullscreen mode", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "https://prawniczek.test" });
  const { window } = dom;
  Object.assign(globalThis, {
    window,
    document: window.document,
    HTMLElement: window.HTMLElement,
    navigator: window.navigator
  });

  let requestedMode: string | undefined;
  window.openai = createSdk({
    async requestDisplayMode(mode) {
      requestedMode = mode.mode;
    }
  });

  const container = window.document.getElementById("root");
  if (!container) {
    throw new Error("Missing root container");
  }

  bootstrapWidget({
    mode: "inline",
    container,
    inlineProps: {
      workspaceName: "Mieszkanie 2026",
      status: "green",
      breaches: [],
      nextAction: "Sprawdź porównanie",
      onOpenFullscreen: () => window.openai?.requestDisplayMode({ mode: "fullscreen" })
    }
  });

  await waitForRender();
  const button = container.querySelector<HTMLButtonElement>(".compliance-card__cta");
  button?.click();
  assert.equal(requestedMode, "fullscreen");
});

test("pip preview stores widget state", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "https://prawniczek.test" });
  const { window } = dom;
  Object.assign(globalThis, {
    window,
    document: window.document,
    HTMLElement: window.HTMLElement,
    navigator: window.navigator
  });

  let savedState: Record<string, unknown> | undefined;
  window.openai = createSdk({
    async setWidgetState(state) {
      savedState = state;
    }
  });

  const container = window.document.getElementById("root");
  if (!container) {
    throw new Error("Missing root container");
  }

  bootstrapWidget({
    mode: "pip",
    container,
    pipProps: {
      title: "Draft unsubscribe",
      summary: "Draft gotowy do wysyłki po zatwierdzeniu.",
      consentToken: "consent_email_2024"
    }
  });

  await waitForRender();
  const persistButton = container.querySelector<HTMLButtonElement>(".pip-preview__secondary");
  persistButton?.click();
  assert.deepEqual(savedState, { consentToken: "consent_email_2024" });
});
