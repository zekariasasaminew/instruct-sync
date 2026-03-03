import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { readLockfile, removeEntry } from "../lockfile.js";

export function remove(name: string, flags: { tool?: string } = {}): void {
  const lock = readLockfile();

  // Collect matching lockfile keys
  const keysToRemove: string[] = [];
  for (const key of Object.keys(lock.packs)) {
    const packName = key.includes("@") ? key.split("@")[0] : key;
    const packTool = key.includes("@") ? key.split("@")[1] : undefined;
    if (packName === name) {
      if (!flags.tool || packTool === flags.tool) keysToRemove.push(key);
    }
  }

  if (keysToRemove.length === 0) {
    console.log(`"${name}" is not installed. Run: instruct-sync installed`);
    return;
  }

  for (const key of keysToRemove) {
    const entry = lock.packs[key];
    const absPath = resolve(process.cwd(), entry.target);
    if (existsSync(absPath)) {
      unlinkSync(absPath);
      console.log(`✓ Deleted ${entry.target}`);
    } else {
      console.log(`  (file ${entry.target} was already missing)`);
    }
    removeEntry(key);
    console.log(`✓ Removed "${key}" from instruct-sync.json`);
  }
}
