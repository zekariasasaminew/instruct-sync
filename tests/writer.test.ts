import { describe, it, expect } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeInstructions, defaultTarget } from "../src/writer.js";

describe("writeInstructions", () => {
  it("creates file and parent directories", () => {
    const dir = mkdtempSync(join(tmpdir(), "instruct-sync-writer-"));
    writeInstructions("# React\nhooks only", ".github/instructions/react.instructions.md", dir);
    const content = readFileSync(join(dir, ".github/instructions/react.instructions.md"), "utf8");
    expect(content).toBe("# React\nhooks only");
  });
});

describe("defaultTarget", () => {
  it("returns instructions path for name", () => {
    expect(defaultTarget("react")).toBe(".github/instructions/react.instructions.md");
  });
});
