# Prawniczek GPT App

Prawniczek łączy guardrails-first workflows dla rodzin, kancelarii i seniorów w ramach Apps SDK. Repozytorium zawiera:

- `server/` – konfigurację MCP (narzędzia, metadane, golden prompts) z walidacją schematów.
- `web/` – komponenty React dla trybów inline, fullscreen i PiP wraz z bundlowaniem esbuild.
- `apps/` – metadane aplikacji dla Kodeks CLI.
- `docs/` – artefakty ewaluacji golden prompts.

## Wymagania

- Node.js ≥ 18.18
- npm 9+

## Instalacja

```bash
npm install
```

## Build i testy

```bash
npm run cloud:test
```

Polecenie uruchamia lint, testy oraz build dla obu pakietów workspace.

## Struktura narzędzi

Zobacz `server/src/tools.ts` i `server/src/metadata.ts` dla pełnych opisów narzędzi, securitySchemes oraz display modes (`inline`, `fullscreen`, `pip`). Wszystkie narzędzia posiadają deskryptory „Use this when… / Do not use for…”, przykłady i oznaczenia RO vs Mut.
