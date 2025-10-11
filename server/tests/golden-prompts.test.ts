import test from "node:test";
import assert from "node:assert/strict";
import { getMcpServerConfig } from "../src/index.js";

test("golden prompts reference registered tools", () => {
  const config = getMcpServerConfig();
  const toolNames = new Set(config.metadata.tools.map((tool) => tool.name));
  for (const prompt of config.goldenPrompts) {
    assert.ok(toolNames.has(prompt.expectedTool), `Unknown tool referenced: ${prompt.expectedTool}`);
  }
});

test("read-only tools include readOnlyHint", () => {
  const config = getMcpServerConfig();
  const missing = config.metadata.tools
    .filter((tool) => tool.access === "ro")
    .filter((tool) => !tool.metadata?.readOnlyHint);
  assert.equal(missing.length, 0, `Missing readOnlyHint on: ${missing.map((tool) => tool.name).join(", ")}`);
});

test("consent token documented on outward actions", () => {
  const config = getMcpServerConfig();
  const outwardTools = config.metadata.tools.filter((tool) =>
    tool.name.startsWith("notify.") || tool.name.startsWith("mail.prepare_") || tool.name.startsWith("mail.connect")
  );
  for (const tool of outwardTools) {
    const input = tool.inputSchema as { properties?: Record<string, { description?: string }> };
    assert.ok(input?.properties?.consent_token, `consent_token required in ${tool.name}`);
  }
});
