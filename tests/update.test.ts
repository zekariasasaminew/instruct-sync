import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const mockLockfile = vi.hoisted(() => ({ readLockfile: vi.fn(), addEntry: vi.fn() }));
const mockGithub = vi.hoisted(() => ({ parseSource: vi.fn(), fetchFile: vi.fn() }));
const mockWriter = vi.hoisted(() => ({ writeInstructions: vi.fn() }));

vi.mock("../src/lockfile.js", () => mockLockfile);
vi.mock("../src/github.js", () => mockGithub);
vi.mock("../src/writer.js", () => mockWriter);

describe("update", () => {
  let cwd: string;
  let originalCwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "instruct-sync-update-"));
    originalCwd = process.cwd();
    process.chdir(cwd);
    vi.clearAllMocks();
    mockGithub.parseSource.mockReturnValue({ owner: "o", repo: "r", path: "p.md", ref: "HEAD" });
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("restores a file that is missing even when SHA is unchanged", async () => {
    mockLockfile.readLockfile.mockReturnValue({
      packs: {
        react: { source: "github:o/r/p.md", ref: "HEAD", sha: "abc123", target: ".github/instructions/react.instructions.md", installedAt: "i" },
      },
    });
    mockGithub.fetchFile.mockResolvedValue({ content: "# React", sha: "abc123" });

    const { update } = await import("../src/commands/update.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await update();

    expect(mockWriter.writeInstructions).toHaveBeenCalledWith("# React", ".github/instructions/react.instructions.md");
    const output = spy.mock.calls.map((c) => c[0]).join("\n");
    expect(output).toContain("restored");
    spy.mockRestore();
  });

  it("skips writing when SHA unchanged and file exists", async () => {
    const target = ".github/instructions/react.instructions.md";
    mkdirSync(join(cwd, ".github/instructions"), { recursive: true });
    writeFileSync(join(cwd, target), "# React");

    mockLockfile.readLockfile.mockReturnValue({
      packs: {
        react: { source: "github:o/r/p.md", ref: "HEAD", sha: "abc123", target, installedAt: "i" },
      },
    });
    mockGithub.fetchFile.mockResolvedValue({ content: "# React", sha: "abc123" });

    const { update } = await import("../src/commands/update.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await update();

    expect(mockWriter.writeInstructions).not.toHaveBeenCalled();
    const output = spy.mock.calls.map((c) => c[0]).join("\n");
    expect(output).toContain("already up to date");
    spy.mockRestore();
  });
});
