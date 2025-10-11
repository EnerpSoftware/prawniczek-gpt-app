import { AppMetadata } from "./types.js";
import { securitySchemes } from "./security.js";
import { toolDescriptors } from "./tools.js";

export const appMetadata: AppMetadata = {
  name: "prawniczek",
  displayName: "Prawniczek — doradca",
  description:
    "Prawniczek pomaga rodzinom, kancelariom i seniorom porównywać oferty, monitorować zgodność i reagować na ryzyka e-mailowe zgodnie z guardrails i zgodami.",
  version: "1.0.0",
  keywords: ["rodzina", "kancelaria", "senior", "email", "compliance"],
  starterPrompts: [
    "Pomóż mojej rodzinie porównać oferty kredytów hipotecznych w workspace 'Mieszkanie 2026'.",
    "Przygotuj dashboard spraw kancelarii i wskaż czerwone flagi w sprawie 'Umowa najmu'.",
    "Oceń czy ta wiadomość do babci wygląda na próbę oszustwa i przygotuj alert dla opiekuna.",
    "Przeskanuj skrzynkę firmową pod kątem phishingu i pokaż draft odpowiedzi."
  ],
  compliance: {
    privacy: "Minimalizujemy dane wrażliwe, wymagamy consent_token przed akcjami wysyłkowymi i stosujemy krótkie TTL dla plików.",
    safety: "Wszystkie akcje są oznaczone jako DRAFT do zatwierdzenia przez użytkownika, brak automatycznej wysyłki.",
    latencyTargets: {
      familyWorkspaceSeconds: 120,
      businessWorkspaceSeconds: 120,
      emailScanSeconds: 30
    }
  },
  securitySchemes,
  tools: toolDescriptors,
  _meta: {
    "openai/outputTemplate": {
      "inline": "prawniczek://components/compliance-card",
      "fullscreen": "prawniczek://components/comparator",
      "pip": "prawniczek://components/pip-preview"
    }
  }
};
