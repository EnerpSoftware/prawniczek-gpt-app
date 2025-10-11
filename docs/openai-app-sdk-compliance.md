# OpenAI App SDK Compliance Analysis

## Executive Summary
- Repo provides structured MCP metadata with Zod validation, ensuring schema-aligned payloads before export to the App Registry.【F:server/src/index.ts†L6-L77】
- App metadata documents compliance posture (privacy, safety, latency) and advertises display-mode widgets for inline/fullscreen/pip usage, aligning with marketplace submission guidance.【F:server/src/metadata.ts†L5-L35】
- Tool catalog covers workspace management, guardrails, elder safety, and email triage with access levels, security schemes, and consent gating that mirror SDK expectations for safe tool invocation.【F:server/src/tools.ts†L5-L880】
- Golden prompts span required personas (family, business, elder, email) and align with documented evaluation artifacts, supporting App Review readiness.【F:server/src/golden-prompts.ts†L3-L54】【F:docs/golden-prompts.json†L1-L27】
- UI widgets use `window.openai` interfaces for mode switching, tool calls, and widget state persistence while surfacing draft disclaimers, demonstrating correct SDK runtime assumptions.【F:web/src/index.tsx†L15-L75】【F:web/src/components/ComplianceCard.tsx†L20-L47】【F:web/src/components/FullscreenComparator.tsx†L20-L135】【F:web/src/components/PipPreview.tsx†L10-L37】【F:web/src/types/openai.ts†L1-L21】

## Metadata & Configuration
- `getMcpServerConfig` validates `appMetadata`, tool descriptors, and golden prompts via Zod before emitting configuration; this prevents malformed submissions that violate App SDK schema contracts.【F:server/src/index.ts†L6-L92】
- Metadata includes display name, keywords, starter prompts, and compliance narratives describing privacy safeguards (consent tokens, TTL) and manual safety confirmations, aligning with policy documentation requirements.【F:server/src/metadata.ts†L5-L26】
- `_meta.openai/outputTemplate` advertises widget URIs for each display mode, supporting SDK display routing expectations.【F:server/src/metadata.ts†L27-L35】

## Tool Definitions & Safety Controls
- Each tool records `useThisWhen`, `doNotUseFor`, schemas, and non-empty examples, which meets App SDK guidance for tool documentation quality.【F:server/src/tools.ts†L5-L880】
- Read-only tools consistently include `metadata.readOnlyHint`, and automated tests enforce this guardrail so the assistant announces non-mutating behavior.【F:server/src/tools.ts†L71-L113】【F:server/tests/golden-prompts.test.ts†L13-L19】
- Mutating tools that reach outside the workspace (notifications, email actions) require `consent_token`, satisfying consent and user-in-the-loop expectations; tests verify this requirement stays enforced.【F:server/src/tools.ts†L668-L711】【F:server/src/tools.ts†L719-L880】【F:server/tests/golden-prompts.test.ts†L21-L29】
- Security schemes distinguish internal read-only operations from OAuth-protected flows with scoped permissions, providing clarity for credential management.【F:server/src/security.ts†L3-L31】
- `conversation.extract_commitments` is bound to the `internal-noauth` scheme, limiting it to tenant-contained analysis and reducing exfiltration risk.【F:server/src/tools.ts†L520-L584】

## Golden Prompts & Evaluation Assets
- Four golden prompts cover the personas enumerated by OpenAI App Review checklists (family, business, elder, email) and map directly to registered tools.【F:server/src/golden-prompts.ts†L3-L54】
- `ensureToolCoverage` ensures every golden prompt references a defined tool, preventing review failures for dangling prompt expectations.【F:server/src/index.ts†L80-L87】
- `docs/golden-prompts.json` tracks precision/recall metrics and enumerates persona coverage, fulfilling evidence expectations for eval submissions.【F:docs/golden-prompts.json†L1-L27】

## Client Widget Integration
- `bootstrapWidget` conditionally renders inline/fullscreen/pip widgets and defaults to safe sample props that continue to respect consent-driven workflows (draft disclaimers, manual transitions).【F:web/src/index.tsx†L15-L75】
- Widgets call `window.openai.requestDisplayMode`, `callTool`, and `setWidgetState` through the typed helper, ensuring compatibility with the Apps SDK runtime and failing early when run outside the hosted environment.【F:web/src/components/FullscreenComparator.tsx†L20-L135】【F:web/src/components/PipPreview.tsx†L10-L37】【F:web/src/types/openai.ts†L1-L21】
- UI copies emphasize “draft” status and manual approval, reinforcing policy messaging surfaced in metadata and aligning with guardrail guidance.【F:web/src/components/ComplianceCard.tsx†L40-L45】【F:web/src/components/FullscreenComparator.tsx†L131-L133】【F:web/src/components/PipPreview.tsx†L30-L36】

## Automated Coverage & Gaps
- Server tests assert golden prompt coverage, read-only hints, and consent token presence, helping maintain compliance invariants as the tool catalog evolves.【F:server/tests/golden-prompts.test.ts†L5-L29】
- Current CI (`npm run cloud:test`) fails because TypeScript lacks React, Node, and jsdom typings, causing lint/build steps to abort; this should be resolved to keep compliance checks trustworthy.【107428†L1-L114】

## Risks & Recommendations
1. **Document consent token fields.** Add descriptive text for each `consent_token` property so SDK reviewers understand token provenance and revocation workflows (currently plain string types).【F:server/src/tools.ts†L668-L711】【F:server/src/tools.ts†L719-L880】
2. **Restore TypeScript lint coverage.** Install the missing `@types/node`, `@types/react`, and `@types/jsdom` dependencies (or configure `types` in tsconfig) to ensure compliance tests can execute during CI.【107428†L1-L114】
3. **Validate reassessment payloads.** `FullscreenComparator` derives `principal` from `totalCost`, which may misalign with server expectations; consider mapping to actual principal/term inputs to avoid tool misuse signals during review.【F:web/src/components/FullscreenComparator.tsx†L24-L38】

Overall, the project adheres closely to OpenAI App SDK structural guidelines; addressing the documentation and linting gaps above will strengthen the submission package.
