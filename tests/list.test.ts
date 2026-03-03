import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const mockLockfile = vi.hoisted(() => ({ readLockfile: vi.fn() }));
vi.mock("../src/lockfile.js", () => mockLockfile);

describe("installed", () => {
  let cwd: string;
  let originalCwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "instruct-sync-list-"));
    originalCwd = process.cwd();
    process.chdir(cwd);
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("shows no packs message when lockfile is empty", async () => {
    mockLockfile.readLockfile.mockReturnValue({ packs: {} });
    const { installed } = await import("../src/commands/installed.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    installed();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("No packs installed"));
    spy.mockRestore();
  });

  it("shows warning when target file is missing", async () => {
    mockLockfile.readLockfile.mockReturnValue({
      packs: {
        react: { source: "s", ref: "HEAD", sha: "abc", target: ".github/instructions/react.instructions.md", installedAt: "i" },
      },
    });
    const { installed } = await import("../src/commands/installed.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    installed();
    const output = spy.mock.calls.map((c) => c[0]).join("\n");
    expect(output).toContain("file missing");
    spy.mockRestore();
  });

  it("shows no warning when target file exists", async () => {
    mockLockfile.readLockfile.mockReturnValue({
      packs: {
        react: { source: "s", ref: "HEAD", sha: "abc", target: ".github/instructions/react.instructions.md", installedAt: "i" },
      },
    });
    mkdirSync(join(cwd, ".github/instructions"), { recursive: true });
    writeFileSync(join(cwd, ".github/instructions/react.instructions.md"), "# React");
    const { installed } = await import("../src/commands/installed.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    installed();
    const output = spy.mock.calls.map((c) => c[0]).join("\n");
    expect(output).not.toContain("file missing");
    spy.mockRestore();
  });
});
