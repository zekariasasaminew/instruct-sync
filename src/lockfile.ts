import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Lockfile, LockEntry } from "./types.js";

const LOCKFILE_NAME = "instruct-sync.json";

export function getLockfilePath(cwd = process.cwd()): string {
  return resolve(cwd, LOCKFILE_NAME);
}

export function readLockfile(cwd = process.cwd()): Lockfile {
  const path = getLockfilePath(cwd);
  if (!existsSync(path)) return { packs: {} };
  return JSON.parse(readFileSync(path, "utf8")) as Lockfile;
}

export function writeLockfile(lockfile: Lockfile, cwd = process.cwd()): void {
  writeFileSync(getLockfilePath(cwd), JSON.stringify(lockfile, null, 2) + "\n", "utf8");
}

export function addEntry(name: string, entry: LockEntry, cwd = process.cwd()): void {
  const lock = readLockfile(cwd);
  lock.packs[name] = entry;
  writeLockfile(lock, cwd);
}

export function removeEntry(name: string, cwd = process.cwd()): void {
  const lock = readLockfile(cwd);
  delete lock.packs[name];
  writeLockfile(lock, cwd);
}
