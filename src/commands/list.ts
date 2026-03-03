import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { readLockfile } from "../lockfile.js";

export function list(): void {
  const lock = readLockfile();
  const entries = Object.entries(lock.packs);
  if (entries.length === 0) {
    console.log("No packs installed. Run: instruct-sync add <name>");
    return;
  }
  console.log(`${"Pack".padEnd(20)} ${"Ref".padEnd(20)} ${"Target"}`);
  console.log(`${"─".repeat(20)} ${"─".repeat(20)} ${"─".repeat(40)}`);
  for (const [name, entry] of entries) {
    const exists = existsSync(resolve(process.cwd(), entry.target));
    const status = exists ? "" : " ⚠ file missing — run: instruct-sync update";
    console.log(`${name.padEnd(20)} ${entry.ref.padEnd(20)} ${entry.target}${status}`);
  }
}
