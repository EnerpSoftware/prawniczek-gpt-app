import { createRoot } from "react-dom/client";
import { ComplianceCard, ComplianceCardProps } from "./components/ComplianceCard.js";
import { FullscreenComparator, FullscreenComparatorProps } from "./components/FullscreenComparator.js";
import { PipPreview, PipPreviewProps } from "./components/PipPreview.js";
import { ensureBaseStyles } from "./styles/inject.js";

export interface BootstrapPayload {
  mode: "inline" | "fullscreen" | "pip";
  container: HTMLElement;
  inlineProps?: ComplianceCardProps;
  fullscreenProps?: FullscreenComparatorProps;
  pipProps?: PipPreviewProps;
}

export function bootstrapWidget(payload: BootstrapPayload) {
  ensureBaseStyles();
  const root = createRoot(payload.container);
  switch (payload.mode) {
    case "inline": {
      const props =
        payload.inlineProps ?? {
          workspaceName: "Mieszkanie 2026",
          status: "amber",
          breaches: ["RRSO powyżej 10%"],
          nextAction: "Poproś bank Alfa o aktualizację oferty",
          onOpenFullscreen: () => window.openai?.requestDisplayMode({ mode: "fullscreen" })
        };
      root.render(<ComplianceCard {...props} />);
      break;
    }
    case "fullscreen": {
      const props =
        payload.fullscreenProps ?? {
          workspaceId: "ws_family",
          budgetId: "budget_family_mortgage",
          offers: [
            {
              id: "offer_1",
              provider: "Bank Alfa",
              rrso: 9.4,
              monthlyPayment: 3950,
              totalCost: 890000,
              breaches: [],
              recommended: true
            },
            {
              id: "offer_2",
              provider: "Bank Beta",
              rrso: 10.1,
              monthlyPayment: 4200,
              totalCost: 935000,
              breaches: ["Przekroczona rata miesięczna"],
              recommended: false
            }
          ]
        };
      root.render(<FullscreenComparator {...props} />);
      break;
    }
    case "pip": {
      const props =
        payload.pipProps ?? {
          title: "Alert Elder Shield",
          summary: "Wiadomość o wnuczku przekroczyła próg ryzyka. Draft wysłano do przeglądu.",
          consentToken: "consent_elder_2024"
        };
      root.render(<PipPreview {...props} />);
      break;
    }
    default:
      throw new Error(`Unsupported mode: ${payload.mode}`);
  }
}

export type { ComplianceCardProps, FullscreenComparatorProps, PipPreviewProps };
