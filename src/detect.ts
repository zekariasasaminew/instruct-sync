import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { ToolName } from "./types.js";

const TOOL_SIGNALS: Array<{ tool: ToolName; paths: string[] }> = [
  { tool: "cursor", paths: [".cursor"] },
  { tool: "claude", paths: ["CLAUDE.md", ".claude"] },
  { tool: "windsurf", paths: [".windsurf", ".windsurfrules"] },
  { tool: "cline", paths: [".clinerules"] },
];

/** Detect which AI tools are present in the given directory (defaults to cwd). */
export function detectTools(cwd = process.cwd()): ToolName[] {
  const detected: ToolName[] = ["copilot"]; // always include copilot
  for (const { tool, paths } of TOOL_SIGNALS) {
    if (paths.some((p) => existsSync(resolve(cwd, p)))) {
      detected.push(tool);
    }
  }
  return detected;
}
