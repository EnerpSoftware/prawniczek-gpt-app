export type SecuritySchemeId = "noauth" | "oauth2";

export interface SecurityScheme {
  id: string;
  type: SecuritySchemeId;
  description: string;
  scopes?: string[];
}

export interface ToolExample {
  name: string;
  description: string;
  arguments: Record<string, unknown>;
}

export interface ToolDescriptor {
  name: string;
  access: "ro" | "mut";
  useThisWhen: string;
  doNotUseFor: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  securitySchemes: string[];
  examples: ToolExample[];
  metadata?: {
    readOnlyHint?: boolean;
    notes?: string[];
    tags?: string[];
  };
}

export interface AppMetadata {
  name: string;
  displayName: string;
  description: string;
  version: string;
  keywords: string[];
  starterPrompts: string[];
  compliance: {
    privacy: string;
    safety: string;
    latencyTargets: {
      familyWorkspaceSeconds: number;
      businessWorkspaceSeconds: number;
      emailScanSeconds: number;
    };
  };
  securitySchemes: SecurityScheme[];
  tools: ToolDescriptor[];
  _meta: Record<string, unknown>;
}

export interface GoldenPrompt {
  id: string;
  persona: "family" | "business" | "elder" | "email";
  utterance: string;
  expectedTool: string;
  expectedArguments: Record<string, unknown>;
}

export interface McpServerConfig {
  metadata: AppMetadata;
  goldenPrompts: GoldenPrompt[];
}
