import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { readLockfile, removeEntry } from "../lockfile.js";

export function remove(name: string): void {
  const lock = readLockfile();
  const entry = lock.packs[name];

  if (!entry) {
    console.log(`"${name}" is not installed. Run: instruct-sync installed`);
    return;
  }

  const absPath = resolve(process.cwd(), entry.target);
  if (existsSync(absPath)) {
    unlinkSync(absPath);
    console.log(`✓ Deleted ${entry.target}`);
  } else {
    console.log(`  (file ${entry.target} was already missing)`);
  }

  removeEntry(name);
  console.log(`✓ Removed "${name}" from instruct-sync.json`);
}
