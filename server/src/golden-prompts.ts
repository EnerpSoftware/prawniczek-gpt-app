import { GoldenPrompt } from "./types.js";

export const goldenPrompts: GoldenPrompt[] = [
  {
    id: "family-offer-comparison",
    persona: "family",
    utterance: "Porównaj nowe oferty bankowe w workspace Mieszkanie 2026 i sprawdź budżet",
    expectedTool: "budget.check_offer",
    expectedArguments: {
      budget_id: "budget_family_mortgage",
      offer: {
        principal: 720000,
        term_months: 300,
        rrso: 9.1,
        fees: [
          { label: "Prowizja", amount: 2000 },
          { label: "Ubezpieczenie", amount: 500 }
        ]
      }
    }
  },
  {
    id: "law-case-dashboard",
    persona: "business",
    utterance: "Pokaż status zgodności sprawy Kaucja klienta i zaproponuj kolejne kroki",
    expectedTool: "case.summary",
    expectedArguments: {
      case_id: "case_kaucja_01"
    }
  },
  {
    id: "elder-risk-alert",
    persona: "elder",
    utterance: "Czy ta wiadomość o wnuczku to scam? Jeśli tak przygotuj alert dla syna",
    expectedTool: "elder.evaluate_risk",
    expectedArguments: {
      text_or_doc_id: "Pilnie potrzebuję przelewu 4000 PLN, podpisano wnuczek",
      context: {
        workspace_id: "ws_elder"
      }
    }
  },
  {
    id: "email-defense-draft",
    persona: "email",
    utterance: "Przeskanuj skrzynkę i przygotuj draft wypisania z newslettera FinQuick",
    expectedTool: "mail.prepare_action",
    expectedArguments: {
      message_id: "msg_finquick_44",
      action: "unsubscribe",
      consent_token: "consent_email_2024"
    }
  }
];
