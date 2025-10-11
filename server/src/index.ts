import { z } from "zod";
import { appMetadata } from "./metadata.js";
import { goldenPrompts } from "./golden-prompts.js";
import { McpServerConfig, ToolDescriptor } from "./types.js";

const toolDescriptorSchema = z.object({
  name: z.string(),
  access: z.union([z.literal("ro"), z.literal("mut")]),
  useThisWhen: z.string(),
  doNotUseFor: z.string(),
  inputSchema: z.record(z.unknown()),
  outputSchema: z.record(z.unknown()),
  securitySchemes: z.array(z.string()).nonempty(),
  examples: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        arguments: z.record(z.unknown())
      })
    )
    .nonempty(),
  metadata: z
    .object({
      readOnlyHint: z.boolean().optional(),
      notes: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional()
    })
    .optional()
});

const appMetadataSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  version: z.string(),
  keywords: z.array(z.string()).min(1),
  starterPrompts: z.array(z.string()).min(1),
  compliance: z.object({
    privacy: z.string(),
    safety: z.string(),
    latencyTargets: z.object({
      familyWorkspaceSeconds: z.number(),
      businessWorkspaceSeconds: z.number(),
      emailScanSeconds: z.number()
    })
  }),
  securitySchemes: z
    .array(
      z.object({
        id: z.string(),
        type: z.union([z.literal("noauth"), z.literal("oauth2")]),
        description: z.string(),
        scopes: z.array(z.string()).optional()
      })
    )
    .nonempty(),
  tools: z.array(toolDescriptorSchema).min(1),
  _meta: z.record(z.unknown())
});

const goldenPromptSchema = z.object({
  id: z.string(),
  persona: z.union([z.literal("family"), z.literal("business"), z.literal("elder"), z.literal("email")]),
  utterance: z.string(),
  expectedTool: z.string(),
  expectedArguments: z.record(z.unknown())
});

export function getMcpServerConfig(): McpServerConfig {
  const metadata = appMetadataSchema.parse(appMetadata);
  const prompts = z.array(goldenPromptSchema).nonempty().parse(goldenPrompts);
  ensureToolCoverage(metadata.tools, prompts);
  return {
    metadata,
    goldenPrompts: prompts
  };
}

function ensureToolCoverage(tools: ToolDescriptor[], prompts: z.infer<typeof goldenPromptSchema>[]): void {
  const toolNames = new Set(tools.map((tool) => tool.name));
  for (const prompt of prompts) {
    if (!toolNames.has(prompt.expectedTool)) {
      throw new Error(`Golden prompt ${prompt.id} references missing tool ${prompt.expectedTool}`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = getMcpServerConfig();
  process.stdout.write(`${JSON.stringify(config, null, 2)}\n`);
}
