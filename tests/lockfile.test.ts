import { describe, it, expect, beforeEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readLockfile, writeLockfile, addEntry, removeEntry } from "../src/lockfile.js";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "instruct-sync-"));
});

describe("readLockfile", () => {
  it("returns empty lockfile when file does not exist", () => {
    expect(readLockfile(dir)).toEqual({ packs: {} });
  });

  it("reads existing lockfile", () => {
    writeLockfile({ packs: { react: { source: "s", ref: "r", sha: "h", target: "t", installedAt: "i" } } }, dir);
    expect(readLockfile(dir).packs["react"]?.source).toBe("s");
  });
});

describe("addEntry / removeEntry", () => {
  it("adds an entry", () => {
    addEntry("react", { source: "s", ref: "r", sha: "h", target: "t", installedAt: "i" }, dir);
    expect(readLockfile(dir).packs["react"]).toBeDefined();
  });

  it("removes an entry", () => {
    addEntry("react", { source: "s", ref: "r", sha: "h", target: "t", installedAt: "i" }, dir);
    removeEntry("react", dir);
    expect(readLockfile(dir).packs["react"]).toBeUndefined();
  });
});
