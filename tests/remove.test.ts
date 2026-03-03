import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const mockLockfile = vi.hoisted(() => ({ readLockfile: vi.fn(), removeEntry: vi.fn() }));
vi.mock("../src/lockfile.js", () => mockLockfile);

describe("remove", () => {
  let cwd: string;
  let originalCwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "instruct-sync-remove-"));
    originalCwd = process.cwd();
    process.chdir(cwd);
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("removes entry from lockfile and deletes the file", async () => {
    const target = ".github/instructions/react.instructions.md";
    mkdirSync(join(cwd, ".github/instructions"), { recursive: true });
    writeFileSync(join(cwd, target), "# React");

    mockLockfile.readLockfile.mockReturnValue({
      packs: { react: { source: "s", ref: "HEAD", sha: "abc", target, installedAt: "i" } },
    });

    const { remove } = await import("../src/commands/remove.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    remove("react");

    expect(existsSync(join(cwd, target))).toBe(false);
    expect(mockLockfile.removeEntry).toHaveBeenCalledWith("react");
    spy.mockRestore();
  });

  it("prints not installed message when pack does not exist", async () => {
    mockLockfile.readLockfile.mockReturnValue({ packs: {} });
    const { remove } = await import("../src/commands/remove.js");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    remove("react");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("not installed"));
    expect(mockLockfile.removeEntry).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
