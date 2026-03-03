import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

let tmpDir: string;

beforeEach(() => {
  tmpDir = join(tmpdir(), `detect-test-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("detectTools", () => {
  it("always includes copilot by default", async () => {
    const { detectTools } = await import("../src/detect.js");
    const tools = detectTools(tmpDir);
    expect(tools).toContain("copilot");
  });

  it("detects cursor when .cursor dir exists", async () => {
    mkdirSync(join(tmpDir, ".cursor"));
    const { detectTools } = await import("../src/detect.js");
    const tools = detectTools(tmpDir);
    expect(tools).toContain("cursor");
  });

  it("detects claude when CLAUDE.md exists", async () => {
    writeFileSync(join(tmpDir, "CLAUDE.md"), "# Claude instructions");
    const { detectTools } = await import("../src/detect.js");
    const tools = detectTools(tmpDir);
    expect(tools).toContain("claude");
  });

  it("detects windsurf when .windsurfrules exists", async () => {
    writeFileSync(join(tmpDir, ".windsurfrules"), "rules");
    const { detectTools } = await import("../src/detect.js");
    const tools = detectTools(tmpDir);
    expect(tools).toContain("windsurf");
  });

  it("detects cline when .clinerules exists", async () => {
    writeFileSync(join(tmpDir, ".clinerules"), "rules");
    const { detectTools } = await import("../src/detect.js");
    const tools = detectTools(tmpDir);
    expect(tools).toContain("cline");
  });

  it("detects multiple tools at once", async () => {
    mkdirSync(join(tmpDir, ".cursor"));
    writeFileSync(join(tmpDir, "CLAUDE.md"), "# Claude");
    const { detectTools } = await import("../src/detect.js");
    const tools = detectTools(tmpDir);
    expect(tools).toContain("copilot");
    expect(tools).toContain("cursor");
    expect(tools).toContain("claude");
  });
});
